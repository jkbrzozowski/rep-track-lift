<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep mock account and profile state in a shared in-memory React provider, separate from training storage; the prototype must not imply real authentication or durable profile storage.
- Choose the next planned day from the last finished workout matching a plan-day name; free workouts must not advance the plan rotation.
