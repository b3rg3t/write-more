---
name: client-mui
description: Use MUI MCP tools when working with Material UI components in the client project
applyTo: client/**
---

# Client MUI Skill

When working with Material UI components in the client project, always use the MUI MCP tools for accurate documentation and component information.

## When to Use MUI MCP Tools

- When implementing or modifying Material UI components
- When looking up MUI component props, APIs, or usage patterns
- When needing examples or documentation for MUI components
- When troubleshooting MUI component issues

## Available MUI MCP Tools

- `mcp_mui-mcp_fetchDocs`: Fetch documentation for specific MUI components or packages
- `mcp_mui-mcp_useMuiDocs`: Get comprehensive MUI documentation from available URLs

## Instructions

1. For any MUI-related questions or implementations, first use `mcp_mui-mcp_useMuiDocs` to get the relevant documentation
2. Use `mcp_mui-mcp_fetchDocs` when you need specific component details
3. Always prefer MCP-provided information over general knowledge for MUI components
4. Ensure all MUI component usage follows the official documentation from MCP tools

## Integration with Client Instructions

This skill works alongside the client.instructions.md rules:
- Keep all user-facing text in localization files
- Use established Material UI patterns
- Follow responsive design principles
- Maintain backward compatibility