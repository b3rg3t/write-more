import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { text } from "../../localization/eng";
import { ITripImage } from "../../models/interface/ITripImage";
import {
  useGetTripImagesQuery,
  useDeleteTripImageMutation,
} from "../../store/reducers/api/apiSlice";
import { API_BASE_URL } from "../../store/reducers/api/util";
import { TOKEN_STORAGE_KEY } from "../../util/authCredentials";
import { TripImageUploadModal } from "../modal/TripImageUploadModal";

type TripImagesSectionProps = {
  tripId?: string;
  isUploadModalOpen: boolean;
  onCloseUploadModal: () => void;
};

export const TripImagesSection = ({
  tripId,
  isUploadModalOpen,
  onCloseUploadModal,
}: TripImagesSectionProps) => {
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [deleteTripImage] = useDeleteTripImageMutation();
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<string, string>>(
    {},
  );
  const [fullImageUrls, setFullImageUrls] = useState<Record<string, string>>(
    {},
  );
  const thumbnailUrlsRef = useRef<Record<string, string>>({});
  const fullImageUrlsRef = useRef<Record<string, string>>({});

  const {
    data: tripImagesResponse,
    isLoading: isTripImagesLoading,
    error: tripImagesError,
  } = useGetTripImagesQuery(tripId || "", {
    skip: !tripId,
  });

  const tripImages = useMemo(
    () => tripImagesResponse?.images ?? [],
    [tripImagesResponse],
  );

  const getAuthorizedImageBlobUrl = async (
    image: ITripImage,
    snapshot: boolean,
  ): Promise<string | undefined> => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token || !tripId) {
      return undefined;
    }

    const response = await fetch(
      `${API_BASE_URL}trips/${tripId}/images/${image._id}?snapshot=${snapshot ? "true" : "false"}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return undefined;
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  };

  useEffect(() => {
    let isCancelled = false;
    const previousUrls = Object.values(thumbnailUrls);

    const loadThumbnails = async () => {
      if (!tripId || tripImages.length === 0) {
        if (!isCancelled) {
          setThumbnailUrls({});
        }
        return;
      }

      const loadedEntries = await Promise.all(
        tripImages.map(async (image) => {
          const url = await getAuthorizedImageBlobUrl(image, true);
          return [image._id, url] as const;
        }),
      );

      if (isCancelled) {
        loadedEntries.forEach(([, url]) => {
          if (url) {
            URL.revokeObjectURL(url);
          }
        });
        return;
      }

      const nextUrls: Record<string, string> = {};
      loadedEntries.forEach(([id, url]) => {
        if (url) {
          nextUrls[id] = url;
        }
      });

      Object.entries(thumbnailUrlsRef.current).forEach(([id, oldUrl]) => {
        if (!nextUrls[id] || nextUrls[id] !== oldUrl) {
          URL.revokeObjectURL(oldUrl);
        }
      });

      thumbnailUrlsRef.current = nextUrls;

      setThumbnailUrls(nextUrls);
    };

    void loadThumbnails();

    return () => {
      isCancelled = true;
      previousUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [tripId, tripImages]);

  useEffect(() => {
    thumbnailUrlsRef.current = thumbnailUrls;
  }, [thumbnailUrls]);

  useEffect(() => {
    fullImageUrlsRef.current = fullImageUrls;
  }, [fullImageUrls]);

  useEffect(() => {
    return () => {
      Object.values(thumbnailUrlsRef.current).forEach((url) =>
        URL.revokeObjectURL(url),
      );
      Object.values(fullImageUrlsRef.current).forEach((url) =>
        URL.revokeObjectURL(url),
      );
    };
  }, []);

  const loadFullImage = async (image: ITripImage) => {
    if (fullImageUrls[image._id]) {
      return;
    }

    const fullImageUrl = await getAuthorizedImageBlobUrl(image, false);
    if (fullImageUrl) {
      setFullImageUrls((prev) => {
        const previousUrl = prev[image._id];
        if (previousUrl && previousUrl !== fullImageUrl) {
          URL.revokeObjectURL(previousUrl);
        }

        return {
          ...prev,
          [image._id]: fullImageUrl,
        };
      });
    }
  };

  const handleOpenSlideshow = (index: number) => {
    setActiveImageIndex(index);
    setIsSlideshowOpen(true);

    const selectedImage = tripImages[index];
    if (selectedImage) {
      void loadFullImage(selectedImage);
    }
  };

  const handleDeleteActiveImage = async () => {
    if (!tripId || !activeImage) {
      return;
    }

    const imageId = activeImage._id.toString();

    // Clean up blob URLs for the deleted image
    const thumbUrl = thumbnailUrlsRef.current[imageId];
    if (thumbUrl) {
      URL.revokeObjectURL(thumbUrl);
      setThumbnailUrls((prev) => {
        const next = { ...prev };
        delete next[imageId];
        return next;
      });
    }
    const fullUrl = fullImageUrlsRef.current[imageId];
    if (fullUrl) {
      URL.revokeObjectURL(fullUrl);
      setFullImageUrls((prev) => {
        const next = { ...prev };
        delete next[imageId];
        return next;
      });
    }

    // Adjust active index before the list shrinks
    if (activeImageIndex >= tripImages.length - 1 && activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
    }

    await deleteTripImage({ tripId, imageId });
  };

  const activeImage = tripImages[activeImageIndex];

  useEffect(() => {
    if (isSlideshowOpen && activeImage) {
      void loadFullImage(activeImage);

      if (tripImages.length > 1) {
        const nextIndex = (activeImageIndex + 1) % tripImages.length;
        const prevIndex =
          (activeImageIndex - 1 + tripImages.length) % tripImages.length;

        void loadFullImage(tripImages[nextIndex]);
        void loadFullImage(tripImages[prevIndex]);
      }
    }
  }, [activeImage?._id, activeImageIndex, isSlideshowOpen, tripImages]);

  useEffect(() => {
    if (swiperInstance && isSlideshowOpen) {
      swiperInstance.slideTo(activeImageIndex, 0);
    }
  }, [activeImageIndex, isSlideshowOpen, swiperInstance]);

  useEffect(() => {
    if (isSlideshowOpen && tripImages.length === 0) {
      setIsSlideshowOpen(false);
    }
  }, [tripImages.length, isSlideshowOpen]);

  const { imageSlideshow, tripDetail } = text.trips;

  return (
    <>
      {isTripImagesLoading ? (
        <Stack alignItems="center" py={2} spacing={1}>
          <CircularProgress size={22} />
          <Typography variant="body2">{tripDetail.loadingImages}</Typography>
        </Stack>
      ) : tripImagesError ? (
        <Typography color="error" sx={{ px: 2, py: 1 }}>
          {tripDetail.imageFetchError}
        </Typography>
      ) : tripImages.length === 0 ? (
        <Typography sx={{ px: 2, py: 1 }} color="text.secondary">
          {tripDetail.noImages}
        </Typography>
      ) : (
        <Stack
          direction="row"
          flexWrap="wrap"
          spacing={1}
          useFlexGap
          sx={{ p: 2 }}
        >
          {tripImages.map((image, index) => (
            <Box
              key={image._id}
              component="button"
              onClick={() => handleOpenSlideshow(index)}
              aria-label={tripDetail.openGallery}
              sx={{
                width: { xs: 84, sm: 110 },
                height: { xs: 84, sm: 110 },
                p: 0,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                overflow: "hidden",
                cursor: "pointer",
                backgroundColor: "transparent",
              }}
            >
              {thumbnailUrls[image._id] ? (
                <Box
                  component="img"
                  src={thumbnailUrls[image._id]}
                  alt={image.originalName}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{ width: "100%", height: "100%" }}
                >
                  <CircularProgress size={18} />
                </Stack>
              )}
            </Box>
          ))}
        </Stack>
      )}

      {!!tripId && (
        <TripImageUploadModal
          open={isUploadModalOpen}
          onClose={onCloseUploadModal}
          tripId={tripId}
        />
      )}

      <Dialog
        open={isSlideshowOpen}
        onClose={() => setIsSlideshowOpen(false)}
        fullScreen
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 1, sm: 1.5 },
            py: { xs: 0.5, sm: 0.75 },
            minHeight: 0,
          }}
        >
          <Typography component="span" variant="body1" noWrap color="primary">
            {activeImage?.originalName}
          </Typography>
          <Stack direction="row" alignItems="center" flexShrink={0}>
            <IconButton
              onClick={() => void handleDeleteActiveImage()}
              aria-label={imageSlideshow.delete}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={() => setIsSlideshowOpen(false)}
              aria-label={imageSlideshow.close}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 0, sm: 0 }, py: 1 }}>
          <Swiper
            modules={[Navigation, Pagination, Keyboard]}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
            initialSlide={activeImageIndex}
            navigation
            keyboard={{ enabled: true }}
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            style={{ minHeight: 280 }}
          >
            {tripImages.map((image) => {
              const imageUrl = fullImageUrls[image._id];
              return (
                <SwiperSlide key={image._id}>
                  <Box
                    sx={{
                      minHeight: 280,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {imageUrl ? (
                      <Box
                        component="img"
                        src={imageUrl}
                        alt={image.originalName || imageSlideshow.fallbackAlt}
                        sx={{
                          width: "100%",
                          maxHeight: "calc(100vh - 120px)",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <CircularProgress />
                    )}
                  </Box>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </DialogContent>
      </Dialog>
    </>
  );
};
