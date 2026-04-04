---
name: Video Architecture
description: How videos are served in the app -- GDrive embed vs YouTube embed vs local files, and which are active
type: project
---

MediaPlayer component (src/components/shared/MediaPlayer.tsx) handles three video source types:
1. Google Drive links -- extracts file ID, renders iframe to /preview endpoint
2. YouTube links -- converts to /embed/ URL, renders iframe
3. Local .mp4 files -- renders HTML5 video element with custom controls

Active video assignments (in live playlists):
- 8 assignments use Google Drive embed (A13, A14, A15, A101-A106)
- 2 assignments use YouTube embed (A4 snake video, A11 shed video)
- 0 assignments use local video files in active paths

GDrive iframe has NO error detection -- if sharing permissions are wrong, player sees blank iframe. Fallback text exists for all videos but 5 of 8 GDrive videos have generic placeholder fallback text.

**Why:** GDrive embed reliability is the #1 launch risk. No programmatic way to detect iframe load failure.
**How to apply:** Always verify GDrive sharing permissions in incognito before launch. Consider replacing generic fallback text with meaningful clues.
