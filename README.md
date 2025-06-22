Welcome to your new TanStack app! 

# Getting Started

To run this application:

```bash
npm install
npm run start  
```

# Building For Production

To build this application for production:

```bash
npm run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
npm run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.


## Linting & Formatting


This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
npm run lint
npm run format
npm run check
```



## Routing
This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).


## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
npm install @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

# HLS Preloading Demo

A demonstration of HLS (HTTP Live Streaming) preloading to improve video playback performance using React-Player. This demo compares video startup times between a preloaded HLS stream and a regular HLS stream.

## Features

- **Real-time HLS Preloading**: Automatically starts loading HLS segments as soon as a URL is entered
- **Side-by-side Comparison**: Two video players showing the difference between preloaded and regular playback
- **Progress Tracking**: Visual progress indicator showing preloading status
- **Performance Metrics**: Timing comparison between the two players
- **Sample Streams**: Pre-configured public HLS test streams
- **React-Player Integration**: Robust video player with built-in HLS support

## How It Works

1. **URL Input**: Enter an HLS stream URL in the input field
2. **Automatic Preloading**: The system immediately starts preloading HLS segments in the background
3. **Progress Monitoring**: Watch the progress bar as segments are loaded
4. **Playback Comparison**: Click "Play Videos" to start both players simultaneously
5. **Performance Analysis**: Compare startup times and buffering behavior

## Sample HLS Streams

The demo includes several public test streams:

- **Mux Test Stream**: `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`
- **Sintel Movie (Akamai)**: `https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8`
- **Tears of Steel (Unified Streaming)**: `https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8`

## Technical Implementation

### HLS Preloading Hook (`useHlsPreload`)
- Manages URL preloading state and progress tracking
- Simulates segment loading for demonstration purposes
- Handles error states and cleanup
- Tracks which URLs have been preloaded

### Video Player Component
- Built with React-Player for robust video playback
- Supports HLS streams with optimized configuration
- Handles loading states, errors, and progress tracking
- Provides timing comparison between players

### Key Technologies
- **React-Player**: Feature-rich video player with HLS support
- **HLS.js**: JavaScript library for HLS playback (used by React-Player)
- **React**: UI framework with custom hooks
- **TanStack Router**: File-based routing
- **Tailwind CSS**: Styling and responsive design

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser**: Navigate to `http://localhost:3000`

4. **Test the Demo**:
   - Enter an HLS stream URL (or use the pre-filled sample)
   - Watch the preloading progress
   - Click "Play Videos" to compare performance

## Expected Results

The preloaded video player should:
- Start faster than the regular player
- Have less initial buffering
- Provide smoother playback experience
- Show fewer loading interruptions

The difference is most noticeable with:
- Streams with longer segment durations
- Slower network connections
- Larger video files

## Browser Compatibility

This demo requires a browser that supports:
- React-Player (most modern browsers)
- HLS.js (used internally by React-Player)
- ES6+ JavaScript features
- HTML5 video elements

## Development

### Project Structure
```
src/
├── hooks/
│   └── useHlsPreload.ts      # HLS preloading logic
├── components/
│   ├── VideoPlayer.tsx       # React-Player video component
│   └── PreloadProgress.tsx   # Progress indicator
└── routes/
    └── index.tsx             # Main demo page
```

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## React-Player Benefits

Using React-Player provides several advantages:
- **Cross-browser compatibility**: Works across different browsers and devices
- **Multiple format support**: HLS, DASH, MP4, and more
- **Built-in controls**: Customizable player controls
- **Event handling**: Comprehensive event system for tracking playback
- **Configuration options**: Extensive configuration for HLS optimization
- **Active maintenance**: Well-maintained library with regular updates

## License

This project is for demonstration purposes. The HLS streams used are public test streams provided by their respective services.
