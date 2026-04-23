# Jobsy 🎓💼

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</div>

<br />

> 🌍 **[English](#english)** | 🇹🇷 **[Türkçe](#türkçe)**

---

<h2 id="english">🌍 English</h2>

### Description
**Jobsy** is a modern, web-based job posting platform specifically designed to bridge the gap between university students looking for part-time/internship opportunities and local businesses seeking young talent. Instead of broad, corporate-focused platforms, Jobsy provides a niche, campus-oriented ecosystem with a premium, user-friendly interface.

### ✨ Features
* **Role-Based Authentication:** Secure registration and login for two distinct user types: `Students` and `Employers` (powered by JWT & bcrypt).
* **Employer Dashboard:** Employers can create, edit, and deactivate job postings, set working hours, specify salaries, and pinpoint job locations on an interactive map.
* **Student Feed & Filtering:** Students can view a dynamic job feed, filter opportunities based on their university, and search for jobs near their campus.
* **Save Jobs:** Students can bookmark/save their favorite job postings to view and apply for them later.
* **Interactive Maps:** Full integration with Leaflet & OpenStreetMap. Employers can drop a custom Jobsy-branded pin to set job locations, and students can view exact locations on a map within the job details.
* **Student Profiles:** Students can enrich their profiles with their university, department, bio, and contact info to stand out to employers.

### 🛠 Tech Stack
* **Frontend:** React 19, Vite, React Router DOM, Axios, Leaflet (React-Leaflet), Vanilla CSS (Custom modern UI with glassmorphism).
* **Backend:** Node.js, Express.js (v5), RESTful API Architecture.
* **Database:** PostgreSQL (Relational schema managed via `pg`).
* **Security & Docs:** JSON Web Tokens (JWT), Joi Validation, Helmet, Morgan, Swagger UI for API documentation.

### 🚀 Getting Started

**1. Clone the repository and install dependencies:**
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

**2. Setup PostgreSQL Database:**
Ensure you have PostgreSQL running. Create a database named `jobsy`.
Add a `.env` file in the `backend` folder with your credentials:
```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jobsy
JWT_SECRET=your_super_secret_key
JWT_REFRESH_SECRET=your_super_refresh_key
PORT=3000
```

**3. Run Migrations & Start Servers:**
```bash
# In the backend directory
npm run setup # runs migrations and seeds universities
npm run dev

# In a new terminal window, navigate to the frontend directory
npm run dev
```

---

<h2 id="türkçe">🇹🇷 Türkçe</h2>

### Açıklama
**Jobsy**, yarı zamanlı iş veya staj arayan üniversite öğrencileri ile dinamik genç yetenekler arayan yerel işletmeleri (kafeler, mağazalar, ajanslar vb.) doğrudan bir araya getiren modern bir iş ilanı platformudur. Geleneksel ve karmaşık kariyer sitelerinin aksine Jobsy, sadece kampüs çevresine odaklanan niş bir ekosistem ve premium, kullanıcı dostu bir arayüz sunar.

### ✨ Özellikler
* **Rol Bazlı Kimlik Doğrulama:** `Öğrenci` ve `İşveren` olmak üzere iki farklı kullanıcı tipi için JWT ve bcrypt destekli güvenli giriş/kayıt sistemi.
* **İşveren Paneli:** İşverenler ilan oluşturabilir, güncelleyebilir, yayından kaldırabilir ve ilan konumunu interaktif harita üzerinden nokta atışı belirleyebilir.
* **Öğrenci Akışı ve Filtreleme:** Öğrenciler, kendi üniversitelerine göre ilanları filtreleyebilir ve kendilerine en uygun kampüs içi/çevresi iş fırsatlarını dinamik bir akışta görüntüleyebilir.
* **İlan Kaydetme:** Öğrenciler ilgilerini çeken ilanları daha sonra incelemek veya başvurmak üzere kaydedebilir (Saved Jobs).
* **İnteraktif Harita (Leaflet):** İşverenler ilan verirken "Jobsy Moru" özel konum ikonuyla haritada yer işaretleyebilir. Öğrenciler de ilan detaylarında işletmenin nerede olduğunu harita üzerinden görebilir.
* **Öğrenci Profilleri:** Öğrenciler; üniversite, bölüm, iletişim bilgileri ve kendilerini tanıtan bir biyografi ekleyerek profillerini zenginleştirebilir.

### 🛠 Kullanılan Teknolojiler (Tech Stack)
* **Frontend:** React 19, Vite, React Router DOM, Axios, Leaflet (React-Leaflet), Vanilla CSS (Cam efekti, yumuşak gölgeler ve modern arayüz tasarımı).
* **Backend:** Node.js, Express.js (v5), RESTful API Mimarisi.
* **Veritabanı:** PostgreSQL (İlişkisel veritabanı).
* **Güvenlik ve Araçlar:** JSON Web Tokens (JWT), Joi (Veri doğrulama), Helmet, Morgan, Swagger UI (API Dokümantasyonu).

### 🚀 Kurulum (Local Development)

**1. Projeyi indirin ve bağımlılıkları kurun:**
```bash
# Backend paketleri
cd backend
npm install

# Frontend paketleri
cd ../frontend
npm install
```

**2. PostgreSQL Veritabanı Ayarları:**
Bilgisayarınızda PostgreSQL çalıştığından emin olun ve `jobsy` adında bir veritabanı oluşturun.
`backend` klasörü içine `.env` dosyası oluşturup bilgilerinizi girin:
```env
DB_USER=postgres
DB_PASSWORD=sifreniz
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jobsy
JWT_SECRET=gizli_anahtariniz
JWT_REFRESH_SECRET=gizli_refresh_anahtariniz
PORT=3000
```

**3. Veritabanını Hazırlayın ve Sunucuları Başlatın:**
```bash
# Backend klasöründe
npm run setup # Tabloları oluşturur ve üniversite verilerini yükler
npm run dev

# Yeni bir terminal açıp frontend klasörüne geçin
npm run dev
```
