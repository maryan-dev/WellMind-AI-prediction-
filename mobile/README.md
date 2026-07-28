# WellMind AI — Flutter Mobile

Same wellness experience as the web app: **Wellness Check**, **Dashboard**, **ML Models**, **Lifestyle**, **History**, and **Settings**. Layout scales to **any screen size** (phones, tablets) using relative units — not fixed pixel layouts for one device.

## Run

1. Start the API (from project root):

```bash
py -3 -m uvicorn api.app:app --reload --host 0.0.0.0 --port 8000
```

2. Mobile app:

```bash
cd mobile
flutter pub get
flutter run
```

### API URL

| Target | Default |
|--------|---------|
| Android emulator | `http://10.0.2.2:8000` |
| iOS simulator / Windows desktop | `http://127.0.0.1:8000` |
| Physical phone on Wi‑Fi | Your PC LAN IP |

```bash
flutter run --dart-define=API_BASE=http://192.168.1.10:8000
```

## Responsive design

- `lib/core/responsive.dart` — `rw()`, `rh()`, `rs()` scale from a 375×812 reference with clamps for very small/large screens.
- `ResponsiveBody` — max content width on tablets.
- Grids use `LayoutBuilder` / `MediaQuery` for column counts.

## Theme

Teal/cyan **WellMind** palette (`AppColors`) — matches the React UI.
