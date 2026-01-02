# @seriphxyz/react

> **Note:** This repo is a read-only mirror. Source lives in a private monorepo.
> For issues/PRs, please open them here and we'll sync changes back.

React hooks for [Seriph](https://seriph.xyz) widgets - comments, reactions, forms, subscriptions, and more.

## Installation

```bash
npm install @seriphxyz/react
```

Works with React 18+ and React 19. Compatible with Next.js, Remix, Vite, and more.

## Hooks

### useSubscribe

Email subscription form:

```tsx
import { useSubscribe } from "@seriphxyz/react";

function SubscribeForm() {
  const [email, setEmail] = useState("");
  const { submit, status, message, error } = useSubscribe({
    siteKey: "your-key",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submit(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
      />
      <button disabled={status === "loading"}>
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </button>
      {status === "success" && <p>{message}</p>}
      {status === "error" && <p>{error?.message}</p>}
    </form>
  );
}
```

### useReactions

Reaction buttons (like, love, clap, etc.):

```tsx
import { useReactions } from "@seriphxyz/react";

function LikeButton() {
  const { counts, userReactions, add, remove, status } = useReactions({
    siteKey: "your-key",
    pageId: "my-page",
  });

  const hasLiked = userReactions.includes("like");

  return (
    <button onClick={() => (hasLiked ? remove("like") : add("like"))}>
      {hasLiked ? "Unlike" : "Like"} ({counts.like || 0})
    </button>
  );
}
```

### useComments

Threaded comments:

```tsx
import { useComments } from "@seriphxyz/react";

function Comments() {
  const { comments, post, status, error } = useComments({
    siteKey: "your-key",
    pageId: "my-page",
  });

  const handleSubmit = async (name, content) => {
    await post(name, content);
  };

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>
          <strong>{comment.authorName}</strong>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
}
```

### useForm

Contact forms with spam protection:

```tsx
import { useForm } from "@seriphxyz/react";

function ContactForm() {
  const { submit, status, message } = useForm({
    siteKey: "your-key",
    formSlug: "contact",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    await submit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit">Send</button>
      {status === "success" && <p>{message}</p>}
    </form>
  );
}
```

### useWaitlist

Waitlist signups:

```tsx
import { useWaitlist } from "@seriphxyz/react";

function WaitlistForm() {
  const { join, status, message, position } = useWaitlist({
    siteKey: "your-key",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await join(email, { name, source: "homepage" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <button type="submit">Join Waitlist</button>
      {status === "success" && <p>{message}</p>}
    </form>
  );
}
```

### useFeedback

Feedback forms:

```tsx
import { useFeedback } from "@seriphxyz/react";

function FeedbackWidget() {
  const { submit, status, message } = useFeedback({
    siteKey: "your-key",
  });

  const handleSubmit = async (type, content) => {
    await submit(type, content, { email, pageUrl: window.location.href });
  };

  // ...
}
```

### usePoll

Polls and voting:

```tsx
import { usePoll } from "@seriphxyz/react";

function Poll() {
  const { poll, vote, hasVoted, status } = usePoll({
    siteKey: "your-key",
    pollId: 123,
  });

  if (!poll) return <div>Loading...</div>;

  return (
    <div>
      <h3>{poll.question}</h3>
      {poll.options.map((option) => (
        <button
          key={option.id}
          onClick={() => vote([option.id])}
          disabled={hasVoted}
        >
          {option.text} ({poll.results?.[option.id] || 0})
        </button>
      ))}
    </div>
  );
}
```

### useAnnouncements

Site announcements:

```tsx
import { useAnnouncements } from "@seriphxyz/react";

function AnnouncementBanner() {
  const { announcements, dismiss, status } = useAnnouncements({
    siteKey: "your-key",
  });

  const visible = announcements.filter((a) => !a.dismissed);

  return (
    <>
      {visible.map((announcement) => (
        <div key={announcement.id}>
          <p>{announcement.content}</p>
          {announcement.isDismissible && (
            <button onClick={() => dismiss(announcement.id)}>Dismiss</button>
          )}
        </div>
      ))}
    </>
  );
}
```

### useViewCounts

Page view tracking:

```tsx
import { useViewCounts } from "@seriphxyz/react";
import { useEffect } from "react";

function PageViews() {
  const { views, uniqueVisitors, record, status } = useViewCounts({
    siteKey: "your-key",
    pageId: "my-page",
  });

  // Record view on mount
  useEffect(() => {
    record();
  }, []);

  return (
    <span>
      {views} views ({uniqueVisitors} unique)
    </span>
  );
}
```

## All Hooks

| Hook | Purpose |
|------|---------|
| `useSubscribe` | Email subscriptions |
| `useReactions` | Page reactions |
| `useComments` | Threaded comments |
| `useForm` | Form submissions |
| `useWaitlist` | Waitlist signups |
| `useFeedback` | Feedback forms |
| `usePoll` | Polls and voting |
| `useAnnouncements` | Site announcements |
| `useViewCounts` | Page view tracking |

## License

MIT
