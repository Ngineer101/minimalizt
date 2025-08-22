---
title: "Building a Lightning-Fast MCP Generator: From Swagger to Model Context Protocol in seconds"
description: "This post walks you through how to automatically generate an MCP server from a Swagger/OpenAPI document."
pubDate: "Jul 1 2025"
heroImage: "/blog-cover-9.jpg"
tags: ["AI", "Tech", "MCP"]
---

The Model Context Protocol (MCP) is revolutionizing how AI systems interact with external tools and APIs. However, manually creating MCP servers for existing APIs can be time-consuming and error-prone. That's why I built **MCPR** — a CLI tool that automatically generates fully functional MCP servers from Swagger/OpenAPI documents.

## What is MCPR?

MCPR (MCP Runner) is a TypeScript-based CLI tool that takes a Swagger/OpenAPI specification and transforms it into a complete MCP server project. Each API endpoint becomes an MCP tool that can be used by AI systems like Claude, Cursor, or ChatGPT, complete with proper input validation, parameter handling, and error management.

## The Architecture: Breaking Down the Build Process

The generator follows a clean, modular architecture with six core components:

### 1. CLI Entry Point (`cli.ts`)

The journey begins with a simple yet powerful CLI interface built with Commander.js:

```typescript
program
  .requiredOption(
    "--doc <path>",
    "Path or URL to Swagger/OpenAPI JSON document",
  )
  .option(
    "--output <path>",
    "Output directory for generated MCP server",
    "./generated-mcp-server",
  )
  .option("--config <path>", "Path to template configuration file");
```

The CLI handles both local files and remote URLs, automatically fetching Swagger documents from web endpoints when needed. This flexibility means you can generate MCP servers from any publicly available API specification.

### 2. Swagger Parser (`parser.ts`)

The heart of the system is the parser that converts Swagger/OpenAPI documents into a structured format. Using the `swagger-parser` library, it:

- **Validates the document** to ensure it's a proper OpenAPI specification.
- **Extracts endpoints** with their HTTP methods, paths, and parameters.
- **Processes schemas** for request/response types.
- **Handles complex parameter types**, including query, path, header, and body parameters.

```typescript
export interface ParsedEndpoint {
  path: string;
  method: string;
  operationId: string;
  summary?: string;
  description?: string;
  parameters: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
}
```

The parser intelligently generates operation IDs when they're missing, ensuring every endpoint has a unique identifier that becomes the MCP tool name.

### 3. Type Generator (`type-generator.ts`)

One of the most sophisticated parts of the system is the TypeScript type generator. It recursively processes OpenAPI schemas and generates proper TypeScript interfaces:

- **Primitive types** (string, number, boolean) map directly.
- **Arrays** become `Array<T>` with proper generic typing.
- **Objects** become interfaces with optional properties marked correctly.
- **Enums** become union types with proper string literals.
- **References** are resolved to their proper type names.

The generator also handles edge cases like properties with hyphens in their names, ensuring the generated code is always valid TypeScript.

### 4. Template Engine (`templates.ts`)

Using Handlebars.js as the templating engine, the system generates four key files:

#### MCP Server Template

The main server file implements the MCP protocol with two core handlers:

- `ListToolsRequestSchema` - Returns available tools.
- `CallToolRequestSchema` - Executes API calls.

Each API endpoint becomes a case in a switch statement, with proper parameter handling:

```typescript
// Query parameters
const queryParams: any = {};
if (args && args["param"] !== undefined) {
  queryParams["param"] = args["param"];
}

// Path parameter substitution
let finalUrl = url;
if (args && args["id"] !== undefined) {
  finalUrl = finalUrl.replace("{id}", String(args["id"]));
}
```

#### Package.json Template

Generates a complete Node.js package with:

- Proper dependency versions.
- Build scripts for TypeScript compilation.
- Binary configuration for CLI usage.

#### TypeScript Configuration

Creates a `tsconfig.json` optimized for MCP servers with an ES2020 target and ESNext modules.

#### Documentation Template

Automatically generates comprehensive README files with usage examples for each generated tool.

### 5. Configuration System (`config.ts`)

The configuration system provides flexibility through:

- **Default configurations** for dependencies and build settings.
- **User overrides** via JSON configuration files.
- **Version synchronization** with the current project's dependencies.

This ensures generated projects use compatible versions and can be customized for specific environments.

### 6. Main Generator (`generator.ts`)

The orchestrator ties everything together:

1. **Parses the Swagger document** using the parser.
2. **Converts endpoints to MCP tools** with proper schema mapping.
3. **Generates TypeScript types** from OpenAPI schemas.
4. **Compiles templates** with the extracted data.
5. **Creates the project structure** with proper file organization.
6. **Installs dependencies** and builds the project to ensure it works.

The generator even includes a post-generation build step to validate the created project:

```typescript
// Install dependencies and build the generated app to ensure it's working
console.log("Installing dependencies...");
const installProcess = spawn("npm", ["install"], {
  cwd: outputDir,
  stdio: "inherit",
});
```

## The Magic: How Swagger Endpoints Become MCP Tools

The transformation from API endpoint to MCP tool follows a systematic process:

### 1. Tool Identification

Each HTTP endpoint in the Swagger document becomes an MCP tool. The tool name comes from the `operationId` field or is auto-generated from the method and path if missing.

### 2. Parameter Mapping

Different parameter types are handled appropriately:

- **Query parameters** → Added to the URL query string.
- **Path parameters** → Substituted in the URL path using string replacement.
- **Header parameters** → Added to the HTTP request headers.
- **Request body** → Sent as JSON in the request body.

### 3. Schema Generation

Input schemas for MCP tools are automatically generated from the OpenAPI parameter definitions, ensuring proper validation and type safety.

### 4. Response Handling

All responses include the full HTTP response (status, headers, and data) formatted as JSON, giving AI systems complete context about the API call results.

## Key Design Decisions

### Why Handlebars?

Handlebars provides a clean separation between logic and templates, making the generated code easy to read and maintain. The helper functions (like `eq` for equality comparisons) keep the templates simple while enabling complex conditional logic.

### Why axios?

Axios provides excellent HTTP client capabilities with built-in JSON handling, request/response interceptors, and error handling - perfect for generated code that needs to be reliable.

### Why stdio Transport?

The stdio transport is the most universal MCP transport method, making the generated servers compatible with any MCP client without additional configuration.

### Type-First Approach

By generating TypeScript types first, the system ensures type safety throughout the generated code while providing excellent developer experience with autocompletion and error checking.

## Usage Examples

### Basic Generation

```bash
node dist/cli.js --doc https://petstore.swagger.io/v2/swagger.json --output petstore-server
```

### Local File

```bash
node dist/cli.js --doc api-spec.json --output my-api-server
```

### With Custom Configuration

```bash
node dist/cli.js --doc api-spec.json --output server --config config.json
```

## The Generated Project Structure

Every generated MCP server follows a consistent structure:

```txt
generated-mcp-server/
├── src/
│   ├── index.ts        # Main MCP server implementation
│   └── types.ts        # TypeScript type definitions
├── package.json        # Node.js package configuration
├── tsconfig.json       # TypeScript compilation settings
└── README.md           # Generated documentation
```

## Real-World Impact

This generator transforms API integration from hours of manual work to seconds of automated generation. Instead of:

1. Reading API documentation.
2. Writing MCP tool definitions.
3. Implementing HTTP calls.
4. Handling parameters and responses.
5. Creating type definitions.
6. Writing documentation.

You simply run:

```bash
mcpr --doc your-api-spec.json
```

And get a complete, tested, documented MCP server ready for production use.

## Technical Challenges Solved

### 1. Parameter Complexity

OpenAPI parameters can be complex, with different locations (query, path, header) and types. The generator handles all combinations correctly.

### 2. Type Safety

Converting OpenAPI schemas to TypeScript types while maintaining accuracy and handling edge cases like recursive objects and circular references.

### 3. Template Maintainability

Creating templates that generate clean, readable code while handling the complexity of different API patterns.

### 4. Error Handling

Ensuring the generated servers gracefully handle API errors and provide meaningful feedback to MCP clients.

### 5. Build Validation

Automatically building generated projects to catch issues early and ensure the output is always functional.

## Future Enhancements

The modular architecture makes it easy to add new features:

- **Authentication support** for API keys, OAuth, and other auth methods.
- **Multiple transport types** beyond stdio (HTTP, WebSocket).
- **Advanced error handling** with retry logic and circuit breakers.
- **Custom template support** for different MCP patterns.
- **Interactive configuration** for fine-tuning generated servers.

## Conclusion

Building MCPR taught me the power of code generation done right. By focusing on a clean architecture, comprehensive type safety, and automated validation, we created a tool that doesn't just generate code - it generates production-ready, maintainable MCP servers that AI systems can immediately use.

The secret sauce is in the details: proper parameter handling, comprehensive error management, automatic dependency management, and post-generation validation. These features transform a simple code generator into a robust development tool that accelerates API integration for the AI era.

Whether you're building AI assistants, automation tools, or any system that needs to interact with existing APIs, MCPR bridges the gap between traditional REST APIs and the emerging world of AI-powered applications through the Model Context Protocol.
