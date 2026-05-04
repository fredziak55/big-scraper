1. Struktura folderów
    * src/ - kod projektu
    * src/controller - kontrolery, czyli pliki w których znajdują się endpoint. Co do zasady jeden endpoint w kontrolerze powinien mieć max 50-60 linijek kodu. Nadmiarowa logika powinna być w innych miejscach.
    * [MVC](https://www.codecademy.com/article/mvc-architecture-model-view-controller)
2. Uporządkowanie połączenia z bazą danych (Prisma albo osobne pliki, w których tworzone są tabele oraz wykonywane zapytania, może nawet mapowane do obiektów)
3. Zmniana frontendu na template engine (EJS) lub dla odważnych React
4. Przetwarzanie scrapowania na kolejkach (np. BullMQ)

Możliwość frontendu:
1. Osobna aplikacja łącząca się z API - BE wystawia endpointy które zwracają JSON, aplikacja np w react tylko wyświetla dane
PLUS: Łatwiej optymalizować np. loader na początku, dopiero jak dostanie dane wyświetla je
MINUS: Dłuższy czas implementacji, większe zużycie zasobów po stronie przeglądarki
2. BE renderuje przy pomocy template engine na serwerze cały HTML i zwraca go (np. EJS)
PLUS: Proste, lekkie dla przeglądarki
MINUS: Kod BE jest połączony z FE, trudniej o dynamiczne wyświetlanie, ładowanie itp.
