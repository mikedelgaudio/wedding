import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class RsvpErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="space-y-6">
          <div className="bg-red-700 text-white p-6 ">
            <h2 className="text-2xl font-semibold mb-4">
              Something went wrong
            </h2>
            <p className="mb-4">
              We're sorry, but there was an error loading your RSVP. Please try
              refreshing the page.
            </p>
            <p className="text-sm">
              If the problem persists, please contact us at{' '}
              <a
                className="underline hover:no-underline"
                href="mailto:wedding@delgaudio.dev"
              >
                wedding@delgaudio.dev
              </a>
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full cursor-pointer bg-stone-900 text-white py-2 rounded hover:bg-stone-700 focus-visible:outline-6 focus-visible:outline-stone-900"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
