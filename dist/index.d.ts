/**
 * @seriphxyz/react - React hooks for Seriph widgets
 *
 * @example Subscribe form
 * ```tsx
 * import { useSubscribe } from '@seriphxyz/react';
 *
 * function Newsletter() {
 *   const { subscribe, status, error } = useSubscribe({
 *     siteKey: 'your-site-key',
 *   });
 *
 *   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 *     e.preventDefault();
 *     const email = new FormData(e.currentTarget).get('email') as string;
 *     subscribe(email);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input type="email" name="email" required />
 *       <button disabled={status === 'loading'}>
 *         {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
 *       </button>
 *       {status === 'success' && <p>Thanks for subscribing!</p>}
 *       {status === 'error' && <p>Error: {error?.message}</p>}
 *     </form>
 *   );
 * }
 * ```
 */
import { type SeriphConfig, type Comment, type Announcement, type PollWithResults, type FeedbackType, type ControllerStatus } from "@seriphxyz/core";
export type { SeriphConfig, SubscribeState, FormState, ReactionsState, CommentsState, WaitlistState, ViewCountsState, FeedbackState, PollState, AnnouncementsState, Comment, Announcement, PollWithResults, FeedbackType, ReactionCounts, SeriphPost, FetchPostsOptions, FetchPostOptions, ControllerStatus, } from "@seriphxyz/core";
export { fetchPosts, fetchPost, getConfigFromMeta, resolveConfig, DEFAULT_ENDPOINT, API_PATH, } from "@seriphxyz/core";
type OptionalSiteKey<T extends SeriphConfig> = Omit<T, "siteKey"> & {
    /** Site key - optional if <meta name="seriph-site-key"> is set */
    siteKey?: string;
};
export interface UseSubscribeOptions extends OptionalSiteKey<SeriphConfig> {
}
export interface UseSubscribeReturn {
    status: ControllerStatus;
    message: string | null;
    error: Error | null;
    subscribe: (email: string) => Promise<void>;
    reset: () => void;
}
/**
 * Hook for handling email subscriptions.
 *
 * @example
 * ```tsx
 * const { subscribe, status, message, error } = useSubscribe({
 *   siteKey: 'your-site-key',
 * });
 *
 * <button onClick={() => subscribe('user@example.com')}>Subscribe</button>
 * ```
 */
export declare function useSubscribe(options: UseSubscribeOptions): UseSubscribeReturn;
export interface UseFormOptions extends OptionalSiteKey<SeriphConfig> {
    /** Form slug/identifier */
    formSlug: string;
}
export interface UseFormReturn {
    status: ControllerStatus;
    message: string | null;
    error: Error | null;
    submit: (data: Record<string, unknown>) => Promise<void>;
    reset: () => void;
}
/**
 * Hook for handling form submissions.
 *
 * @example
 * ```tsx
 * const { submit, status, error } = useForm({
 *   siteKey: 'your-site-key',
 *   formSlug: 'contact',
 * });
 *
 * const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 *   e.preventDefault();
 *   const formData = new FormData(e.currentTarget);
 *   submit(Object.fromEntries(formData));
 * };
 * ```
 */
export declare function useForm(options: UseFormOptions): UseFormReturn;
export interface UseReactionsOptions extends OptionalSiteKey<SeriphConfig> {
    /** Content identifier (e.g., post slug) */
    contentId: string;
    /** Auto-fetch reactions on mount (default: true) */
    autoFetch?: boolean;
}
export interface UseReactionsReturn {
    counts: Record<string, number>;
    userReactions: string[];
    status: ControllerStatus;
    error: Error | null;
    addReaction: (type: string) => Promise<void>;
    removeReaction: (type: string) => Promise<void>;
    refresh: () => Promise<void>;
}
/**
 * Hook for handling reactions (likes, claps, etc.).
 *
 * @example
 * ```tsx
 * const { counts, userReactions, addReaction, removeReaction } = useReactions({
 *   siteKey: 'your-site-key',
 *   contentId: 'my-post-slug',
 * });
 *
 * <button onClick={() => addReaction('like')}>
 *   Like ({counts.like || 0})
 * </button>
 * ```
 */
export declare function useReactions(options: UseReactionsOptions): UseReactionsReturn;
export interface UseCommentsOptions extends OptionalSiteKey<SeriphConfig> {
    /** Content identifier (e.g., post slug) */
    contentId: string;
    /** Auto-fetch comments on mount (default: true) */
    autoFetch?: boolean;
}
export interface UseCommentsReturn {
    comments: Comment[];
    status: ControllerStatus;
    error: Error | null;
    postComment: (author: string, content: string, options?: {
        authorEmail?: string;
        parentId?: string;
    }) => Promise<void>;
    refresh: () => Promise<void>;
}
/**
 * Hook for handling comments.
 *
 * @example
 * ```tsx
 * const { comments, status, postComment } = useComments({
 *   siteKey: 'your-site-key',
 *   contentId: 'my-post-slug',
 * });
 *
 * {comments.map(comment => (
 *   <div key={comment.id}>
 *     <strong>{comment.authorName}</strong>: {comment.content}
 *   </div>
 * ))}
 *
 * <button onClick={() => postComment('Anonymous', 'Great post!')}>
 *   Add Comment
 * </button>
 * ```
 */
export declare function useComments(options: UseCommentsOptions): UseCommentsReturn;
export interface UseWaitlistOptions extends OptionalSiteKey<SeriphConfig> {
}
export interface UseWaitlistReturn {
    status: ControllerStatus;
    message: string | null;
    position: number | null;
    error: Error | null;
    join: (email: string, options?: {
        name?: string;
        source?: string;
    }) => Promise<void>;
    reset: () => void;
}
/**
 * Hook for handling waitlist signups.
 *
 * @example
 * ```tsx
 * const { join, status, message, position } = useWaitlist({
 *   siteKey: 'your-site-key',
 * });
 *
 * <button onClick={() => join('user@example.com')}>Join Waitlist</button>
 * {status === 'success' && <p>You're #{position} on the list!</p>}
 * ```
 */
export declare function useWaitlist(options: UseWaitlistOptions): UseWaitlistReturn;
export interface UseViewsOptions extends OptionalSiteKey<SeriphConfig> {
    /** Page identifier (e.g., slug or URL path) */
    pageId: string;
    /** Auto-record view on mount (default: true) */
    autoRecord?: boolean;
}
export interface UseViewsReturn {
    views: number;
    uniqueVisitors: number;
    status: ControllerStatus;
    error: Error | null;
    record: () => Promise<void>;
    refresh: () => Promise<void>;
}
/**
 * Hook for tracking and displaying page views.
 *
 * @example
 * ```tsx
 * const { views, uniqueVisitors } = useViews({
 *   siteKey: 'your-site-key',
 *   pageId: '/blog/my-post',
 * });
 *
 * <span>{views} views ({uniqueVisitors} unique)</span>
 * ```
 */
export declare function useViews(options: UseViewsOptions): UseViewsReturn;
export interface UseFeedbackOptions extends OptionalSiteKey<SeriphConfig> {
}
export interface UseFeedbackReturn {
    status: ControllerStatus;
    message: string | null;
    error: Error | null;
    submit: (type: FeedbackType, content: string, options?: {
        email?: string;
        pageUrl?: string;
    }) => Promise<void>;
    reset: () => void;
}
/**
 * Hook for handling feedback submissions.
 *
 * @example
 * ```tsx
 * const { submit, status } = useFeedback({
 *   siteKey: 'your-site-key',
 * });
 *
 * <button onClick={() => submit('feature', 'Add dark mode!')}>
 *   Submit Feedback
 * </button>
 * ```
 */
export declare function useFeedback(options: UseFeedbackOptions): UseFeedbackReturn;
export interface UsePollOptions extends OptionalSiteKey<SeriphConfig> {
    /** Poll slug */
    slug: string;
    /** Auto-fetch poll on mount (default: true) */
    autoFetch?: boolean;
}
export interface UsePollReturn {
    poll: PollWithResults | null;
    status: ControllerStatus;
    error: Error | null;
    vote: (selectedOptions: string[]) => Promise<void>;
    hasVoted: boolean;
    refresh: () => Promise<void>;
}
/**
 * Hook for displaying and voting on polls.
 *
 * @example
 * ```tsx
 * const { poll, vote, hasVoted } = usePoll({
 *   siteKey: 'your-site-key',
 *   slug: 'favorite-framework',
 * });
 *
 * {poll && (
 *   <div>
 *     <h3>{poll.question}</h3>
 *     {poll.options.map(opt => (
 *       <button key={opt.id} onClick={() => vote([opt.id])} disabled={hasVoted}>
 *         {opt.text} ({poll.results[opt.id] || 0} votes)
 *       </button>
 *     ))}
 *   </div>
 * )}
 * ```
 */
export declare function usePoll(options: UsePollOptions): UsePollReturn;
export interface UseAnnouncementsOptions extends OptionalSiteKey<SeriphConfig> {
    /** Auto-fetch announcements on mount (default: true) */
    autoFetch?: boolean;
}
export interface UseAnnouncementsReturn {
    announcements: Announcement[];
    status: ControllerStatus;
    error: Error | null;
    dismiss: (announcementId: number) => Promise<void>;
    refresh: () => Promise<void>;
}
/**
 * Hook for displaying site announcements.
 *
 * @example
 * ```tsx
 * const { announcements, dismiss } = useAnnouncements({
 *   siteKey: 'your-site-key',
 * });
 *
 * {announcements.map(ann => (
 *   <div key={ann.id} className={`announcement-${ann.announcementType}`}>
 *     {ann.content}
 *     {ann.isDismissible && (
 *       <button onClick={() => dismiss(ann.id)}>Dismiss</button>
 *     )}
 *   </div>
 * ))}
 * ```
 */
export declare function useAnnouncements(options: UseAnnouncementsOptions): UseAnnouncementsReturn;
//# sourceMappingURL=index.d.ts.map