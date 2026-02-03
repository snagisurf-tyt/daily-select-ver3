#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
skills_dir="$repo_root/.claude/skills"

mkdir -p "$skills_dir"

link_skill_dir() {
  local src="$1"
  local name="$2"
  local target="$skills_dir/$name"

  if [ -L "$target" ]; then
    return 0
  fi

  if [ -e "$target" ]; then
    # Keep local/custom skills or existing directories untouched.
    return 0
  fi

  ln -s "$src" "$target"
}

if [ -d "$repo_root/vendor/anthropics-skills/skills" ]; then
  for d in "$repo_root"/vendor/anthropics-skills/skills/*; do
    [ -d "$d" ] || continue
    name="$(basename "$d")"
    link_skill_dir "../../vendor/anthropics-skills/skills/$name" "$name"
  done
fi

if [ -d "$repo_root/vendor/openai-skills/skills/.curated" ]; then
  for d in "$repo_root"/vendor/openai-skills/skills/.curated/*; do
    [ -d "$d" ] || continue
    name="$(basename "$d")"
    link_skill_dir "../../vendor/openai-skills/skills/.curated/$name" "$name"
  done
fi
