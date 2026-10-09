# Strength Tracker

Buduję aplikację przeglądarkową mobile first, gdzie będę mógł śledzić postępy swojego treningu siłowego. Potrzebuję też wersji na komputer, ale jest mniej ważna, ponieważ na siłowni ludzie mają ze sobą głównie telefony. 

Moim wzorem architektury informacji jest aplikacja LiftLog. Jej zsreeny masz w załącznikach. W mojej wersji niepotrzebny jest feed, wiec jedna z zakładek całkowicie wylatuje. Na początek ma to być osobisty dziennik, a nie strata dla linterów, chociaż z czasem może zostać o to rozbudowane (na razie przyszłość, więc w tym momencie nie istotne). Nie wzoruj się na UI z Liftloga. Na wygląd aplikacji mam inny pomysł. 

Na początku w profilu ustawiasz jakim planem treningowym idziesz: Własny, PPL, Calisthenics, osobno wszystkie partie mięśni  itd. Po wybraniu masz predefiniowane plany wg tego co się wybrało. W planie własnym sam ustalasz plan treningowy. Na początku treningu na siłowni "otwiwrasz" nowy trening w aplikacji i dodajesz jakie ćwiczenia wykonujesz, jaki ciężar, ile powtórzeń, o ile zwiększasz ciężar między seriami (o ile to robisz) itd. Dla ułatwienia myślę, ze może najpierw powinno wybrać się partię mięśni jaką trenujesz a dopiero później konkretne ćwiczenie, które dzięki temu będzie łatwiej znaleźć. Wybór partii będzie takim filtrem ograniczającym liczbę ćwiczeń do przeglądania. Oczywiście potrzeba jest wyszukiwarka, aby sprawniej znajdować ćwiczenia. 

Mam dla Ciebie gotowe inspiracje do wyglądu UI, ale na tym etapie skupmy się na surowym UX i architekturze informacji. Resztą zajmiemy się w następnych krokach.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://rep-track-lift.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a87eafa3-0401-4654-a186-45e69685e4fa).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
