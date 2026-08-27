# App Breakdown Structure

The project includes multiple pages. Here are the pages I've identified while breaking down the requirements.

1. Login page
2. Home page
3. ChatList page
4. Chat page
5. Message component
6. Chat Info page
7. specific user account page
8. account settings page
9. admin panel

## 1. Login page -- TODO

что содержит?

- login form - to authorise users
  - inputs for email and password
  - submit button

Что нужно для начала:

- компонент login
- класс Login
- роутер

Что требуется для полного функционала:

- Компоненты:
  - логин
  - хоум

- Классы:
  - Login

  - model/mockUsers.ts
  - Login.аутентификация()

- `router` should pass the component to the `view` on the route url
- form needs to have values linked to `signal`
- pass input values to the `event handler`
- event handler should compare the credentials agains a `set of users` (before server implementation)
- users should be `instances` of the same `class` - User
- users have to have distinct roles `user | admin | superadmin`

Identified entities:

1. Page Component -> src/app/login/
2. Router -> app.routes.ts
3. Signals and observables -> login.ts
4. Event handler -> login.ts
5. HTML template -> login.html
6. File container for the mock users ->

## 2. Home page -- TODO

что содержит?

- компонент страницы, который состоит из дочерних компонентов

1. Первый уровень -> чаты/навбар/поиск
2. Второй уровень -> чат/группа/страница юзера или группы
3. Третий уровень -> сообщение/навигация/кнопки/линки/ форма инпута сообщения

Что нужно для начала:

- логин -> хоум

- Компоненты:
  - страница логин
    - логин форма с переадрессацией (можно сразу без проверок)
  >>>homepage
    - мокап листа чатов
    - навбар (можно мокап или заглушки для маршрутов)

- Классы:
  - class app (app root)
  - class login
  - class home

Что требуется для полного функционала:

- Компоненты:
  - страница логин
    - логин форма + аунтификация + переадрессация
  >>>homepage
    - чатлист пользователя
      - чат из чатлиста
  - поисковая строка
  - навбар + переадрессация (рабочие маршруты)

- Классы:
  - Login
  - Home
  - Navbar
  - App
  - Chatlist
  - Chat
  - app.routes.ts

  - model/mockChats.ts
  - model/mockUsers.ts

## 3.`chatlist` component -- TODO

собирает лист чатов

- компонент каждого отдельного чата, навигация по li из листа

## 4. `chat` component -- TODO 

Для каждого чата:

- компонент сообщения
- мокап сообщения

Какие есть особенности у чатов:

- личный чат (два участника, переход из шапки в профиль)
- групповой чат (два и более участников, есть админ, есть настройки имени и участников, есть свой никнейм по которому присоединяются новые участники)
- канал (односторонний чат, один человек админ делится сообщениями, есть свой никнейм для доступа)

- чат удаляется суперадмином (групповой/канал) по реквесту.
- личный чат удаляется у участников с их стороны, удаляется полностью если все участники удалили чат.

Как представляется класс чат:

- свой айди - стринг или номер
- участники - массив айди юзеров
- админ - айди юзера
- массив сообщений, сортируемый по времени отправки

Что нужно для начала:

- логин -> хоум -> чаты лист -> линк на чат

- Компоненты:
  - логин: простая форма с переадрессацией в хоум
    - хоум: простой навбар + простой лист мокап чатов
      - чаты: простой лист мокап чатов
      - чат линк: ссылка на страницу чата из списка
        >>> Chat: мокап имя чата + мокап кнопки действия + простой список сообщений + мокап форма отправки сообщения
          - messageList: простой шаблон с мокап датой 
            - message: простой шаблон с мокап датой (можно даже без него)

- Классы:
  - Login
  - Home
  - ChatList
  - Chat

- Модели:
  - UserModel
  - ChatModel
  - MessageModel

- Сервисы:
  - ChatListService
    - getChatsByUserId(userId) 
  - ChatMessageListService
    - getMessagesByChatId(chatId)

Что требуется для полного функционала:

- логин -> хоум -> чаты лист -> линк на чат

- Компоненты:
  - login: форма с аунтефикацией + переадрессацией в хоум
    - home: навбар + чатлист -> чат
      - chatList: лист чатов для авторизованного юзера из реквеста на сервер
        - chatLink: ссылка на страницу чата из списка
          > Chat чат страница: имя чата + кнопки действия + список сообщений + форма отправки сообщения
            - messageList: шаблон листа содержащий сообщения
              - message: шаблон с content + date + isEdited + isDelivered? + isRead?

- Классы + методы:
  - login
    - home
      - navbar
          - user.logout()
          - user.getChats() -> idk if better have chats -> store users or users -> store chats.
      - chatlist
        - чатлист.get(userId) -> get chats
          - chat - personal / group / channel
            - чат.get(chatId) -> get messages
            - чат.update() -> update messages (cascade on message.delete() or some other way with signals);
              - messageList
                - message
                  - message.send(chatId) -> 
                  - message.edit(userId, chatId) ->
                  - message.delete(chatId, userId) ->
              - chatInfo - personal
                - чат.delete()
          - chatInfo - groups/channels
            - setChatName()
            - setChatPic()
            - kickUser() - admin
            - deleteChat() - admin
      - profile
        - addToFriends() -- not at this stage (but button can be added in the template)
        - startChat() -> new chat
          

- Модели:
  - UserModel    
  - ChatModel    
  - MessageModel
  - ChatListModel    
  - ChatMessageListModel   

- Сервисы:
  - UserAuthService      
  - UserLogoutService    

  - CreateNewChatListService 
  - CreateNewChatMessageListService 
  
  - ChatChangesService 
    - changeName
    - changeProfilePicture
    - kickUser
  - ChatListService
    - getChatsByUserId(userId) 
  - ChatMessageListService
    - getMessagesByChatId(chatId)

  - MessageService  
    - edit
    - delete
    - send

  - AdminRequestService
  

## 5. `message` component: -- TODO

Как представляется класс сообщение

- текст = string
- медиа (только картинка) не знаю как представлять
- дата отправки = date
- отправитель (юзер или не юзер для позиционирования на странице чата) = senderId
- чатАйди? не знаю наверное нужно = chatId
- bool изменялось или нет = isEdited
- метод изменения edit()
- метод удаления delete()
- состояние прочитанности/непрочитанности в сообщении = isRead

Какие особенности у сообщений:

- удаляется отправителем, админом, (наверное и суперАдмином, не знаю, есть ли у него доступ к чатам => к личным чатам нет, к группам = по реквесту, к каналам = есть)
- изменяется/ удаляется только отправителем
- возможно пересылается (forward) в другой чат, или отвечается (reply) внутри своего чата (как будто надо, но пока не первая необходимость)

Что требуется для начала

- Компоненты:
  - login
  - home
    - chatlist
      - chat
        - messageList
          > Message

- Классы + методы:
  - login -> bypass auth + router
  - home + router
    - chatList + getChats() + router
      - chat + getMessages()

- Модели:
  - UserModel    
  - ChatModel    
  - MessageModel 

- Сервисы:  
  
  - ChatListService
    - getChatsByUserId(userId) 
  
  - ChatMessageListService
    - getMessagesByChatId(chatId)

  - MessageService  
    - edit
    - delete
    - send

Что требуется для полного функционала

- Компоненты:
  - login
  - home
    - navbar
    - search
    - chatlist
      - chat
        - messageList
          > Message

  - admin panel
    - requestList
      - request
        - requestMessage
          > Message
          - sender
          - reportedAccount
          - reportedMessage
            > Message
        - actionDialogue
          - responseMessage
          - confirm action / decline action
            - confirmationDialogue
              - yes
              - no
    - channelList / groupList
      - channelLink
        - chat(channel)
          - messageList
            > Message

- Модели:
  - UserModel    
  - ChatModel    
  - MessageModel
  - ChatListModel    
  - ChatMessageListModel   

- Сервисы:
  - UserAuthService      
  - UserLogoutService    

  - CreateNewChatService 
    - personal
    - group
    - channel
  - CreateNewChatListService 
  - CreateNewChatMessageListService 
  
  - ChatChangesService 
    - changeName
    - changeProfilePicture
    - kickUser
  - ChatListService
    - getChatsByUserId(userId) 
  - ChatMessageListService
    - getMessagesByChatId(chatId)

  - MessageService  
    - edit
    - delete
    - send

  - SearchService
  - AdminRequestService

## 6. Chat info page -- TODO

Существует для группы/канала
Личный чат отправляет на страницу собеседника

Что делает

- показывает список участников
- Админу:
  - дает доступ к настройкам чата
  - дает доступ к кику юзеров
  - дает доступ к реквесту на бан юзера (по кнопке report -> сообщение + причина -> отправить)
  - дает доступ к реквесту на удаление группы (по кнопке delete chat -> сообщение + причина -> отправить)
  - дает доступ к изменению аватарки
  - дает доступ к изменению идентификатора чата
  - дает доступ к передаче статуса админа (перед выходом из группы)
- Юзеру:
  - дает доступ к изменению названия
  - дает доступ к выходу из группы (кнопка leave group/channel -> обновляет список чатов юзера == стирает этот чат из списка)
- Суперадмину:
  - дает доступ к удалению группы/канала
  - дает доступ к списку пользователей
  - дает доступ к бану пользователей? либо через сам реквест в админке
  - все остальное (кроме чтения сообщений)

Что содержит

- класс + шаблон + роут для компонента
- список участников
- название (изменяемое)
- кнопки удаления группы/ кика(на юзере) / бана(на юзере) для админа

Что требуется для начала

- логин -> хоум -> чаты -> чат линк -> чат инфо

- Компоненты:
  - логин: простая форма с переадрессацией в хоум
    - хоум: простой навбар + простой лист мокап чатов
      - чаты: простой лист мокап чатов
        - чат: простой список мокап сообщений (можно даже без компонента сообщения)
          > чат инфо: мокап имя чата + мокап участники + мокап кнопки-действия

- Классы:
  - login
  - home
  - chatlist
  - messageList
  - chat

- Модели:
  - UserModel    
  - ChatModel    
  - ChatListModel    
  - ChatMessageListModel    
  - MessageModel 

- Сервисы:
  - CreateNewChatListService 
  - CreateNewChatMessageListService 
  
  - ChatChangesService 
    - changeName
    - changeProfilePicture
    - kickUser
  
  - ChatListService
    - getChatsByUserId(userId) 
  
  - ChatMessageListService
    - getMessagesByChatId(chatId)

  - MessageService  
    - edit
    - delete
    - send

Что требуется для полного функционала

- логин -> хоум -> чаты -> чат линк -> чат инфо
- логин -> хоум -> поиск -> результаты -> чат линк
- админ -> админ панель -> мои группы/каналы -> чат линк
- суперадмин -> админ панель -> все группы/каналы -> чат линк

- Компоненты:
  - login
  - home
    - navbar
    - search
    - chatlist
      - chat
        - messagesList
          > Chat Info
  - admin panel
    - channelList / groupList
      - channelLink
        - chat(channel)
          > Chat Info

- Классы:
  - login
  - home
  - user + admin + superadmin
  - chatlist
  - chat + group + channel

- Модели:
  - UserModel    
  - ChatModel    
  - MessageModel 
  - ChatListModel    
  - ChatMessageListModel  

- Сервисы:
  - UserAuthService      
  - UserLogoutService    

  - CreateNewChatService 
    - personal
    - group
    - channel
  - CreateNewChatListService 
  - CreateNewChatMessageListService 
  
  - ChatChangesService 
    - changeName
    - changeProfilePicture
    - kickUser
  - ChatListService
    - getChatsByUserId(userId) 
  - ChatMessageListService
    - getMessagesByChatId(chatId)

  - MessageService  
    - edit
    - delete
    - send

  - SearchService
  - AdminRequestService

## 7. User Account -- TODO

Существует для юзера/админа/суперадмина

Переход:

- Юзеру:
  - из хоум -> навбар (свой аккаунт)
  - из поиска (другой юзер)
- Админу:
  - из списка юзеров канала
  - все от юзера
- Суперадмину:
  - из админ панель -> инфо группы
  - из админ панель -> инфо канала
  - из реквестов
  - все от юзера
  - все от админа

Что делает:

- Юзеру:
  - показывает профиль пользователя
  - дает с ним списаться
- Админу:
  - дает написать репорт
  - дает увидеть в какой его группе/канале он есть
  - все из юзера
- СуперАдмину:
  - все из юзера
  - все из админа
  - дает забанить юзера/админа

Что требуется для начала

- Компоненты:
  - login
  - home
    - navbar
      - account
        > User Account (my)
    - search (mock search result)
      - userList
        - userLink
          > User Account (other)

- Классы:
  - login + auth + ?session state
  - home + navbar + search
  - user (me OR other) <- auth token

Что требуется для полного функционала

Путь к компоненту:

- логин -> аунтефикация -> хоум -> навбар -> аккаунт линк >>>
- логин -> аунтефикация -> хоум -> поиск -> список юзеров -> линк на юзера >>>
- админ панель -> группа/канал -> участники -> линк на юзера >>>
- админ панель -> кик реквест -> линк на юзера / линк на автора реквеста >>>
- суперадмин панель -> бан реквест -> линк на юзера / линк на автора реквеста >>>

- Компоненты:
  - login
  - home
    - navbar
      - account
        > User Account (my)
    - search
      - userList
        - userLink
          > User Account (other)
    - chatlist
      - chat
        - messageList
          - message
        - chatInfo
          - chatMembersList
            - userLink
              > User Account (other)
  - admin panel
    - requestList
      - request
        - requestMessage
          - message
          - requestSender
            > User Account (other)
          - reportedAccount
            > User Account (other)
          - reportedMessage
            - message
        - actionDialogue
          - responseMessage
          - confirm action
          - decline action
            - confirmationDialogue
              - yes
              - no
    - channelList / groupList
      - channelLink / group
        - chat(channel/group)
          - messageList (channel)
            - messages (channel)
          - chatInfo
            - chatInfoControls
              - actionDialogue
                - confirm action
                - cancel action
            - chat(channel/group) members
              > User Account (other) + (me)?
            - chat(channel) admin(s)
              > User Account (other) + (me)?

- Классы:
  - login + auth + session data
  - home + navbar + search
  - user (me OR other) + admin + superadmin <- auth token
  - adminPanel + fulfillRequest/declineRequest + sendResponse
  - superAdminPanel

- Модели:
  - UserModel    
  - ChatModel    
  - MessageModel 
  - ChatListModel    
  - ChatMessageListModel  

- Сервисы:
  - UserAuthService      
  - UserLogoutService    

  - CreateNewChatService 
    - personal
    - group
    - channel
  - CreateNewChatListService 
  - CreateNewChatMessageListService 
  
  - ChatChangesService 
    - changeName
    - changeProfilePicture
    - kickUser
  - ChatListService
    - getChatsByUserId(userId) 
  - ChatMessageListService
    - getMessagesByChatId(chatId)

  - MessageService  
    - edit
    - delete
    - send

  - SearchService
  - AdminRequestService

## 8. account settings page -- TODO

Существует для юзера/админа/суперадмина

Переход:

- Юзеру:
  - из хоум -> навбар (свой аккаунт)
- Админу:
  - все от юзера
- Суперадмину:
  - все от юзера

Что делает:

- Юзеру:
  - показывает профиль пользователя
  - доступ к изменению имени
  - доступ к изменению пароля
  - доступ к изменению почты
  - доступ к изменению аватарки
  - запрос на изменение юзернейма
  - запрос на удаление аккаунта
- Админу:
  - все из юзера
  - (кроме) не может удалить аккаунт, пока является админом группы
  - запрос на удаление группы/канала
- СуперАдмину:
  - все из юзера
  - все из админа
  - (кроме) не может удалить аккаунт

Что требуется для начала

- Компоненты:
  - login
    - loginForm
  - home
    - navbar
      - account
        - User Account (my)
          > Account Settings

- Классы:
  - login ?session state
  - home
  - navbar 
  - profile
  - user (me OR other) <- auth token

- Модели:
  - UserModel    
  - ChatModel    
  - MessageModel 
  - ChatListModel    
  - ChatMessageListModel  

- Сервисы:
  - UserAuthService  
    - session state    
  - UserLogoutService    
  
  - AccountSettingsService
    - request deletion
    - update name
    - change username
    - change password

Что требуется для полного функционала

Путь к компоненту:

- логин -> аунтефикация -> хоум -> навбар -> аккаунт линк -> User Account (my) >>>

- Компоненты:
  - login
  - home
    - navbar
      - account
        - User Account (my)
          > Account Settings

- Классы:
  - login + auth + session data
  - home + navbar + account
  - user (me OR other) + admin + superadmin <- auth token

- Модели:
  - UserModel        

- Сервисы:
  - UserAuthService      
  - UserLogoutService  

  - AccountSettingsService
    - request deletion
    - update name
    - change username
    - change password
    - delete account -> superAdmin request

  - AdminRequestService

## 9. admin panel -- TODO

Существует только для админа/суперадмина

Путь к компоненту:

- Админу:
  - хоум
    - навбар
      >>> админ панель
- Суперадмину:
  - хоум
    - навбар
      >>> админ панель

Что делает:

- Админу:
  - просмотр реквестов на кик юзера
  - лист всех групп, где текущий юзер админ
    - линк на группу
      - переход к chatInfo
  - лист всех каналов, где текущий юзер админ
    - линк на канал
      - переход к chatInfo
- СуперАдмину:
  - просмотр реквестов на бан юзера
  - лист всех групп
    - линк на группу
      - переход к chatInfo
  - лист всех каналов
    - линк на канал
      - переход к chatInfo


Что требуется для начала

- Компоненты:
  - login
  - home
    - navbar
      >>> Admin Panel

- Классы:
  - login + auth + ?session state
  - home + navbar 
  - user (me OR other) <- auth token

Что требуется для полного функционала

- Компоненты:
  - login
  - home
    - navbar
      >>> Admin Panel

- Классы:
  - login + auth + ?session state
  - home + navbar 
  - user (me OR other) <- auth token
    - admin check on server before rendering page OR conditional render based on the returned User Object

- Модели:
  - UserModel    
  - ChatModel    
  - MessageModel 
  - ChatListModel    
  - ChatMessageListModel  

- Сервисы:
  - UserAuthService  
    - session state    
  - UserLogoutService    
  
  - AccountSettingsService
    - request deletion
    - update name
    - change username
    - change password


  - AdminRequestService
  - ResolveAdminRequestService
    - Resolve request -> set isResolved true and remove from the dashboard
    - Delete accounts
    - Give admin roles
    - Send message to issuer