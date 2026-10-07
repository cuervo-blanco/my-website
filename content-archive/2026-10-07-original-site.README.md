# Website before the October 7 redesign

The original website remains browsable at **`/classic/`**. Its Work, Dev, Animation, Contact and Terms pages use the original styles, content and compiled visual assets. Links and routing are adapted to `/classic/` in an isolated build copy; the source archive is unmodified. The archived pages are marked `noindex,follow` so search engines can favor the current website.

## Deployment checkpoints and live rollback

Annotated Git tags identify the versions:

- `site-before-redesign-2026-10-07`: the complete original source at `53f787109707d6422219307a03afeb78d3489688`.
- `site-redesign-2026-10-07`: the redesigned website, including this browsable archive.
- `site-restored-palette-2026-10-07`: the revised design with the original constellation palette, animals and stars, and factual copy.

The repository's existing deployment workflow publishes `master` to Firebase Hosting. To restore the original live site, first ensure `git status --short` is empty, then revert the revisions in reverse order and push. This preserves the checkpoints and the repository's history:

```bash
git revert --no-edit site-restored-palette-2026-10-07 site-redesign-2026-10-07
git push origin master
```

Wait for **Deploy to Firebase Hosting on merge** to succeed, then verify `https://jaimeosvaldo.com`. If subsequent changes cause conflicts, resolve them before pushing. Firebase Hosting's release history also offers a direct rollback to a retained earlier live release.

To return only to the first redesign, revert `site-restored-palette-2026-10-07` and push.

## Exact source identity

- Git commit: `53f787109707d6422219307a03afeb78d3489688`
- Compact source: `2026-10-07-original-site.source.tar.gz`
- SHA-256: recorded in `2026-10-07-original-site.source.tar.gz.sha256`
- Full original tree: `2026-10-07-original-site.manifest.json`, including every original file's Git blob hash, mode and byte size.

The tarball preserves the original code, CSS/SCSS, configuration, lockfile, documentation and existing content archives directly from this commit. Source image/font directories and public media are retained in the repository rather than duplicated in the tarball. The browsable snapshot has its own compiled image, font, CSS and JavaScript assets; original public audio, posters, video, résumé, icons and firmware use their existing root URLs.

## Recover the entire original website

The cleanest full recovery is a separate checkout from the original Git commit. These commands leave the redesigned website in place:

```bash
git worktree add --detach /tmp/jaime-original-site 53f787109707d6422219307a03afeb78d3489688
cd /tmp/jaime-original-site
npm ci
npm run build
npm run dev
```

If the repository's history is unavailable, recover the code into a new directory and copy the retained assets:

```bash
mkdir -p /tmp/jaime-original-source
tar -xzf content-archive/2026-10-07-original-site.source.tar.gz -C /tmp/jaime-original-source
mkdir -p /tmp/jaime-original-source/src/assets
cp -R src/assets/img src/assets/fonts /tmp/jaime-original-source/src/assets/
mkdir -p /tmp/jaime-original-source/public
rsync -a --exclude='classic/' public/ /tmp/jaime-original-source/public/
cd /tmp/jaime-original-source
npm ci
npm run build
npm run dev
```

The asset-copy command omits `public/classic`, which is part of the redesign. The manifest identifies the exact original asset paths and hashes if retained assets later change. For byte-exact original assets, recover them from the fixed Git commit above.

Check the compact source archive before extraction:

```bash
cd content-archive
shasum -a 256 -c 2026-10-07-original-site.source.tar.gz.sha256
```

To reproduce the browsable archive, use `node scripts/archive-original.mjs` from the repository root. It reads the fixed original commit and compiles an isolated temporary checkout. Move the existing `public/classic` directory aside first; the script refuses to replace an existing snapshot.
