import { UserList } from "./UserList";
import { text } from "../../localization/eng";
import { useGetAllUsersQuery } from "../../store/reducers/api/apiSlice";
import { useMemo } from "react";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";
import { PageHeader } from "../layout/PageHeader";
import { UserForm } from "./UserForm";
import { Stack } from "@mui/material";

export const Users = () => {
  const { data, isLoading, isUninitialized, isFetching, error } =
    useGetAllUsersQuery();

  const sortedData = useMemo(() => {
    return data
      ? [...data].sort((a, b) => a.username.localeCompare(b.username))
      : [];
  }, [data]);

  const { header } = text.user;
  const { loading, createUser, noUsers, fetchError } = text.user.usersList;

  return (
    <>
      <UserForm />
      <PageHeader
        title={header}
        amount={data ? data.length : 0}
        styles={{ mt: 2 }}
      />
      <RtkQueryWrapper
        isLoading={isLoading || isUninitialized}
        data={data}
        error={error}
        isFetching={isFetching}
        texts={{
          loading,
          createMessage: createUser,
          noData: noUsers,
          fetchError,
        }}
        onCreate={() => console.log("Create user")}
      >
        <Stack spacing={2}>
          <UserList users={sortedData} />
        </Stack>
      </RtkQueryWrapper>
    </>
  );
};
