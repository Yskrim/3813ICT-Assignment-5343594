# App Breakdown Structure

The project includes multiple pages. Here are the pages I've identified while breaking down the requirements.

## Pages & routes

| #   | Page                      | Route (пример)               | Кто видит              |
| --- | ------------------------- | ---------------------------- | ---------------------- |
| 1   | Login                     | `/login`                     | все                    |
| 2   | Home (shell)              | `/`                          | auth                   |
| 3   | Group list + channel list | в Home sidebar               | auth                   |
| 4   | ChannelRoom               | `/groups/:gId/channels/:cId` | member                 |
| 5   | Group info / settings     | `/groups/:gId/info`          | member / admin         |
| 6   | User profile              | `/users/:id`                 | auth                   |
| 7   | Account settings          | `/settings`                  | свой                   |
| 8   | Admin panel               | `/admin`                     | groupAdmin, superAdmin |
| —   | DM (optional)             | `/ChannelRooms/:id`          | participants           |

Дочерние (не отдельные страницы): Navbar, Search, MessageList, Message, MessageInput, MemberList, RequestList, ConfirmDialog.

## Shared (один раз)

**Models:** User, Group, Channel, Message, ChannelRoom (DM), AdminRequest, ChannelHistory(last 5) — см. models.md  
**Services:** Auth, User, Group, Channel, AdminRequest, Account; Message + Socket → Phase 2  
**Guards:** authGuard, roleGuard  
**Roles:** user → groupAdmin → superAdmin (права в clientBriefing.md)

### 1. Login

- Form: username + password → AuthService → redirect Home
- Phase 1: mock users / JSON auth

### 2. Home

- Layout: Navbar + Search + sidebar (groups → channels) + router-outlet
- Одна активная комната за раз

### 3. Sidebar lists

- Groups пользователя; внутри находятся channels
- Links на room / group info

### 4. Channel room

- Header (name, leave, info)
- MessageList + MessageInput (только пока «в комнате»)
- Join → до 5 last messages; Leave → wipe local
- Нет unread, нет quote
- Phase 1: mock messages; WS Phase 2

### 5. Group info

- Members, name/image/description/theme (admin)
- Kick (group admin); request create channel / delete group
- Channel list этой группы

### 6. User profile

- Просмотр; start DM; report/ban по роли

### 7. Account settings

- displayName, password, email, avatar, birthday, personal theme
- Delete account (ограничения admin/superAdmin)

### 8. Admin panel

- groupAdmin: свои groups, pending requests (свои), kick-related UI
- superAdmin: approve createChannel / deleteGroup, ban, all groups

## 3. `GroupList` component

Показывает список чатов текущего пользователя с возможностью выбрать чат.

- Структура:
  - Login
    - Home
      - GroupList
        - GroupLink (элемент списка чатов)

---

## 4. `ChannelRoom` component

Отображает выбранный чат, список сообщений, поле для ввода сообщений.

Структура:

- Login
  - Home
    - GroupList
      - GroupLink
        - ChannelRoom (имя чата, действия, список сообщений, отправка сообщения)
          - MessageList
            - Message

---

## 5. `Message` component

Показывает отдельное сообщение (текст, автор, время, статус — прочитано/изменено).

- Структура:
  - ChannelRoom
    - MessageList
      - Message

---

## 6. ChannelRoom Info Page

Информация о чате (участники, настройки для админа, выйти/редактировать для юзера).

- Структура:
  - ChannelRoom
    - GroupInfo
      - ChannelList
      - MemberList
        - Member (UserLink)

---

## 7. User Account

Профиль пользователя — информацию и основные действия (написать, пожаловаться, бан для админа).

- Структура перехода:
  - Home
    - Navbar
      - Account (profile myself)
    - Search
      - UserList
        - UserLink (profile other)
    - GroupList
      - GroupLink
        - GroupInfo
          - ChannelList
          - MemberList
            - UserLink (profile other)
    - AdminPanel
      - Requests
        - UserLink (profile other)

---

## 8. Account Settings Page

Позволяет юзеру менять свое имя, пароль, почту, аватар, запросить удаление/смену юзернейма.

- Структура:
  - Home
    - Navbar
      - Account
        - AccountSettings

---

## 9. Admin Panel

Для админа/суперадмина — просмотр и обработка реквестов, список групп/каналов, доступ к информации о пользователях/чатах.

- Структура:
  - Home
    - Navbar
      - AdminPanel
        - RequestList
          - Request (kick/ban)
        - GroupList / ChannelList
          - GroupLink / ChannelLink
            - GroupInfo
