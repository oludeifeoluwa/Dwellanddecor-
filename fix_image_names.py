from __future__ import annotations

import re
import shutil
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PUBLIC_DIR = ROOT / 'public' / 'images'
ASSET_DIR = ROOT / 'src' / 'assets' / 'images'
ARCHIVE_DIR = ROOT / 'archive'
RAW_UPLOADS_DIR = ARCHIVE_DIR / 'raw_uploads'
DUPE_DIR = ARCHIVE_DIR / 'duplicate_images'

IMAGE_SUFFIXES = ('.jpg', '.jpeg', '.png', '.webp')


def canonical_name(filename: str) -> str:
    name = filename.strip()
    if not name:
        return name

    # Fix malformed double extension files like name.jpg.jpg
    while name.lower().endswith('.jpg.jpg'):
        name = name[:-4]
    while name.lower().endswith('.jpeg.jpeg'):
        name = name[:-5]

    # Remove duplicate copies created by Windows/macOS like name(1).jpg
    name = re.sub(r'\(\d+\)', '', name)

    # Normalize timestamp-generated images: name_1786651234567.jpg -> name.jpg
    name = re.sub(r'(?i)_(\d{10,})\.(jpg|jpeg|png|webp)$', r'.\2', name)

    # Clean leftover repeated suffixes like .jpg.jpg after regex steps
    if name.lower().endswith('.jpg.jpg'):
        name = name[:-4]

    return name


def is_duplicate_variant(filename: str) -> bool:
    lower = filename.lower()
    if lower.endswith('.jpg.jpg') or lower.endswith('.jpeg.jpeg'):
        return True
    if re.search(r'\(\d+\)', filename):
        return True
    if re.search(r'(?i)_(\d{10,})\.(jpg|jpeg|png|webp)$', filename):
        return True
    return False


def choose_preferred(files: list[Path]) -> Path:
    def score(path: Path) -> tuple[int, int, str]:
        name = path.name.lower()
        duplicate_penalty = 1 if is_duplicate_variant(path.name) else 0
        timestamp_penalty = 1 if re.search(r'(?i)_(\d{10,})\.(jpg|jpeg|png|webp)$', path.name) else 0
        return (duplicate_penalty + timestamp_penalty, len(path.name), name)

    return min(files, key=score)


def ensure_dirs() -> None:
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    RAW_UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    DUPE_DIR.mkdir(parents=True, exist_ok=True)


def archive_current_public_images() -> None:
    if not PUBLIC_DIR.exists():
        return

    for item in sorted(PUBLIC_DIR.iterdir()):
        if item.is_file():
            target = RAW_UPLOADS_DIR / item.name
            if target.exists():
                target.unlink()
            shutil.move(str(item), str(target))
            print(f'Moved raw upload to archive: {item.name}')


def rebuild_live_images() -> None:
    if not ASSET_DIR.exists():
        return

    grouped: dict[str, list[Path]] = defaultdict(list)
    for item in sorted(ASSET_DIR.iterdir()):
        if item.is_file():
            grouped[canonical_name(item.name)].append(item)

    for canonical, files in sorted(grouped.items()):
        if not canonical:
            continue
        chosen = choose_preferred(files)
        target = PUBLIC_DIR / canonical

        for item in files:
            if item == chosen:
                continue
            archive_target = DUPE_DIR / item.name
            if archive_target.exists():
                archive_target.unlink()
            shutil.move(str(item), str(archive_target))
            print(f'Moved duplicate to archive: {item.name} -> {archive_target.name}')

        if target.exists():
            if target.stat().st_size < chosen.stat().st_size:
                target.unlink()
                shutil.copy2(str(chosen), str(target))
                print(f'Updated live asset: {canonical}')
        else:
            shutil.copy2(str(chosen), str(target))
            print(f'Copied live asset: {canonical}')


def cleanup_duplicates_in_public() -> None:
    for item in sorted(PUBLIC_DIR.iterdir()):
        if not item.is_file():
            continue
        candidate = canonical_name(item.name)
        if candidate != item.name:
            target = PUBLIC_DIR / candidate
            if target.exists() and target != item:
                if item.stat().st_size >= target.stat().st_size:
                    item.unlink()
                    print(f'Removed duplicate live file: {item.name}')
                    continue
            shutil.move(str(item), str(target))
            print(f'Renamed live asset: {item.name} -> {candidate}')


def main() -> None:
    ensure_dirs()
    archive_current_public_images()
    rebuild_live_images()
    cleanup_duplicates_in_public()

    print(f'\nLive images in {PUBLIC_DIR}: {len(list(PUBLIC_DIR.iterdir()))}')
    for item in sorted(PUBLIC_DIR.iterdir()):
        if item.is_file():
            print(item.name)


if __name__ == '__main__':
    main()

