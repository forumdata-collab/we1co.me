#!/bin/bash
# Silent watchdog: only output if something is wrong
set -e
LOG=/home/ubuntu/we1co.me/lcsd_closures.log
SPORT_LOG=/home/ubuntu/we1co.me/sport_ground_sync.log
RVM_LOG=/home/ubuntu/we1co.me/rvm_sync.log
ALERT=""

for f in "$LOG" "$SPORT_LOG" "$RVM_LOG"; do
  if [ -f "$f" ]; then
    LAST=$(tail -20 "$f")
    if echo "$LAST" | grep -q "FAIL"; then
      ALERT="$ALERT\n❌ $(basename $f): FAIL detected"
    fi
    HOUR=$(date +%H)
    if [ "$HOUR" -ge 6 ] && [ "$HOUR" -le 22 ]; then
      AGE=$(( $(date +%s) - $(stat -c %Y "$f" 2>/dev/null || echo 0) ))
      if [ "$AGE" -gt 14400 ]; then
        ALERT="$ALERT\n⏰ $(basename $f): stale (${AGE}s since update)"
      fi
    fi
  else
    ALERT="$ALERT\n❌ $(basename $f): missing"
  fi
done

for h in /home/ubuntu/we1co.me/index.html /home/ubuntu/we1co.me/kt.html; do
  if ! grep -q 'HK_HOLIDAYS' "$h" 2>/dev/null; then
    ALERT="$ALERT\n❌ $(basename $h): HK_HOLIDAYS missing"
  fi
done

if [ -n "$ALERT" ]; then
  echo -e "🚨 we1co.me Watchdog Alert:$ALERT"
fi
