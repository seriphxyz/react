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
import { type SeriphConfig, type Comment, type ControllerStatus } from "@seriphxyz/core";
export type { SeriphConfig, SubscribeState, FormState, ReactionsState, CommentsState, Comment, ReactionCounts, SeriphPost, FetchPostsOptions, FetchPostOptions, ControllerStatus, } from "@seriphxyz/core";
export { fetchPosts, fetchPost, DEFAULT_ENDPOINT, API_PATH, } from "@seriphxyz/core";
export interface UseSubscribeOptions extends SeriphConfig {
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
export interface UseFormOptions extends SeriphConfig {
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
export interface UseReactionsOptions extends SeriphConfig {
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
export interface UseCommentsOptions extends SeriphConfig {
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
//# sourceMappingURL=index.d.ts.map