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

- Private pages live under src/routes/_authenticated/ (client-only gate); per-type page access is defined once in src/lib/roles.ts — why: one place decides who sees what.
- User types are stored in public.user_roles and chosen once via the choose_role database function — why: never trust user-editable profile data for permissions.
