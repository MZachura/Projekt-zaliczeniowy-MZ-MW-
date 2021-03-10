# Projekt zaliczeniowy 

Aplikacja stworzona w ramach przedmiotu Inżynieria Internetu. Jest to aplikacja "backend'owa" opierająca się o zasady REST. 
Aplikacja zajmuje się agregacją playlist na zewnętrznym API którym jest Web api Spotify.

Wykorzystane technologie:
- node js
- express js
- spotify-web-api-node
- joi
- jwt

Utworzone kontrolery:
- me    - przedstawia informacje zalogowanego użytkownika w Spotify Api
- auth   - wykonuje autoryzacje lokalną i łączenie się z bazą danych w mongo atlas
- authsp    - wykonuje autoryzaje serwerową z Spotify Api
- playlists    - wspomniana agregacja playlist 
- callback      - informacja zwrotna z serwera Spotify Api dająca dostęp do zasobów jej bazy danych 
- refreshToken     - odświerzenie tokenu który pozwala na komunikacje z serwerem Spotify Api

Utworzone modele:
- user      -model użytkownika 

Routes

[POST]  /api/users/user - tworzy nowego uzytkownika nalezy przesłać w body takiego json<br></br>
{<br></br>
    "name": "user_name",<br></br>
    "email": "email_name@email.com",<br></br>
    "password": "123456789"<br></br>
}

[POST] /api/users/auth-token - uwierzytelniamy uzytkownika (tworzymy auth-token) w body nalezy przeslac json<br></br>
{<br></br>
    "email": "email_name@email.com",<br></br>
    "password": "123456789"<br></br>
}

[GET] /api/me - wyswietla sciezki api<br></br>

[GET]   /api/refresh_token - odswieza token <br></br>

[GET]   /api/playlists - wyswietla wszystkie playlisty <br></br>

[GET]   /api/playlists/:id - zwraca zawartość playlisty o danym id<br></br>

[POST]  /api/playlists/:name - tworzy playliste z podana nazwa<br></br>

[POST] /api/playlists/song/:playlistid?track - dodaje utwór do wskazanej playlisty <br></br>

[DELETE] /api/playlists/:id - usuwa utwór z playlisty


Do uruchomienia aplikacji potrzebne jest zarestrowanie aplikacji w Spotify oraz utworzenie pliku .env z potrzebnymi informacjami:
- clientSecret  - secret podany po rejestracji aplikacji 
- clientId  - id zarejestrowanej aplikacji 
- JWT_SECRET    -secret potrzebny do zakodowania i dekodowania tokenów jwt
- DB_CONNECT    - ścieżka łącząca z bazą 
