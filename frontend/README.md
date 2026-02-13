# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Build Android (Capacitor)

This project is set up with Capacitor for Android packaging.

1. Build web assets: `npm run build`
2. Sync to Android project: `npm run cap:sync`
3. Open Android Studio: `npm run android` (runs build, sync, then opens the native project)
4. From Android Studio: select a device/emulator and Run, or Build > Generate Signed Bundle/APK (choose AAB for Play Store).

Native code lives in `android/` (added by Capacitor) and reads the Vite build output from `dist/`.

## Token & Ads flow

- Default token: 0, max 10. Setiap request API mengurangi 1 token; tanpa token API diblok.
- Tambah token: tekan tombol `+` di navbar → memicu rewarded ad AdMob → setelah reward diterima, +5 token (maks 10). Saat ini memakai test AdMob IDs; ganti ke ID produksi.
- Jika token 0, akan muncul peringatan di atas konten; tambahkan token untuk memuat data.

## AdMob

Iklan telah dinonaktifkan (komponen banner dihapus, tombol token memakai hitung mundur lokal). Jika ingin menyalakan lagi, tambahkan kembali komponen iklan dan ad unit sesuai kebutuhan.
