git checkout --orphan gh-pages
git reset --hard
git commit --allow-empty -m "Init"
git checkout main
rm -rf dist
git worktree add dist gh-pages