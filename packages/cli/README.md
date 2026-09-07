# Bigcapital CLI

A command-line interface for interacting with the Bigcapital API.

## Installation

```bash
npm install -g @bigcapital/cli
```

Or use directly with `npx`:

```bash
npx @bigcapital/cli --help
```

## Configuration

Before using the CLI, you need to configure your API credentials:

```bash
# Set your API key
bigcapital config set api-key your-api-key-here

# Set the base URL of your Bigcapital instance
bigcapital config set base-url https://api.bigcapital.ly

# Optionally set a default organization ID
bigcapital config set organization-id your-org-id

# Verify your configuration
bigcapital config get
```

Configuration is stored in `~/.config/bigcapital-nodejs/config.json`.

## Usage

### Items

List all items/products:

```bash
# List all items
bigcapital items list

# Limit results
bigcapital items list --limit 10

# Paginate
bigcapital items list --page 2 --limit 25

# Filter by type (inventory, service, product)
bigcapital items list --type inventory

# Show only active items
bigcapital items list --active-only
```

### Invoices

List all sale invoices:

```bash
# List all invoices
bigcapital invoices list

# Filter by customer
bigcapital invoices list --customer 123

# Filter by status
bigcapital invoices list --status overdue

# Paginate results
bigcapital invoices list --page 1 --limit 20
```

## Commands

| Command | Description |
|---------|-------------|
| `config set <key> <value>` | Set configuration value (api-key, base-url, organization-id) |
| `config get` | Display current configuration |
| `items list` | List all items/products |
| `invoices list` | List all sale invoices |

## Global Options

| Option | Description |
|--------|-------------|
| `-V, --version` | Output the version number |
| `-h, --help` | Display help for command |

## Environment Variables

The CLI will also read from environment variables if set:

- `BIGCAPITAL_API_KEY` - Your API key
- `BIGCAPITAL_BASE_URL` - The base URL of your Bigcapital instance
- `BIGCAPITAL_ORGANIZATION_ID` - Default organization ID

## Development

```bash
# Build the CLI
pnpm run build

# Watch mode for development
pnpm run dev

# Type check
pnpm run typecheck
```

## License

ISC
