#!/bin/sh
# Installs Debian packages from ~/debs (kept by actions/cache), going to the mirror only when the cache is empty, and
# then with timeouts and retries: on some runners apt-get stalled for 25 minutes on the mirror, and the 2026-11-07
# hacozy-reels run lost 10 minutes to one download attempt with no retry (exit 124). apt resumes partial downloads
# from the archives dir, so a retry carries on where the stall left it.
#
#   sh tools/apt.sh <package>...
set -e
mkdir -p ~/debs
if ! ls ~/debs/*.deb > /dev/null 2>&1; then
  opts="-o Acquire::http::Timeout=20 -o Acquire::https::Timeout=20 -o Acquire::Retries=5"
  for i in 1 2 3; do timeout 300 sudo apt-get $opts update -qq && break; done
  ok=
  for i in 1 2 3; do
    echo "downloading packages (try $i)"
    if timeout 420 sudo apt-get $opts install -y -qq --no-install-recommends --download-only -o dir::cache::archives="$HOME/debs" "$@" > /dev/null; then ok=1; break; fi
    echo "::warning::package download try $i failed or stalled"
  done
  [ -n "$ok" ] || { echo "::error::the packages could not be downloaded"; exit 1; }
  sudo chown -R "$(id -u)" ~/debs
fi
sudo dpkg -i ~/debs/*.deb > /dev/null
