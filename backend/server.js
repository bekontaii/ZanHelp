import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'frontend', 'dist');
const port = process.env.PORT || 8080;

const users = new Map();

const content = {
  features: [
    { title: 'AI заң кеңесшісі', description: 'Жұмыстан шығару, айыппұл, келісімшарт, неке, алимент және тұтынушы құқығы бойынша түсінікті жауаптар.' },
    { title: 'Құжаттар шаблоны', description: 'Келісімшарт, арыз, сенімхат және шағым үлгілері: аты-жөніңізді енгізіп, дайын файл алыңыз.' },
    { title: 'Онлайн заңгер', description: 'Чат, аудио және видео арқылы заңгерден тікелей кеңес алу мүмкіндігі.' },
    { title: 'Құқықтық білім', description: 'Заңдық терминдер, қысқаша түсіндірмелер және тест сұрақтары.' },
    { title: 'Бизнеске көмек', description: 'ИП ашу, келісімшарт тексеру, бизнес құжаттар және кәсіпкерлерге заң кеңесі.' },
  ],
  tools: [
    { title: 'Айыппұл тексеру', description: 'ЖСН немесе көлік нөмірін енгізіп, айыппұл бар-жоғын бірден біліңіз.' },
    { title: 'Аноним шағым', description: 'Заң бұзушылық туралы дәлел жүктеп, аты-жөніңізді көрсетпей хабарлаңыз.' },
    { title: 'Жаңалықтар', description: 'Жаңа заңдар, өзгерістер және күнделікті өмірге пайдалы құқықтық кеңестер.' },
    { title: 'Жеке кабинет', description: 'Құжаттарды сақтау, сұрақтар тарихын көру және жазылымды басқару.' },
  ],
  market: [
    { label: 'TAM', value: '15+ млн', text: 'Қазақстандағы интернет қолданушылар' },
    { label: 'SAM', value: '5-7 млн', text: 'Құқықтық көмек қажет адамдар' },
    { label: 'SOM', value: '50 000 - 100 000', text: 'Алғашқы кезеңдегі мақсатты қолданушылар' },
  ],
  audience: [
    { title: 'Студенттер', description: 'Оңай әрі түсінікті құқықтық білім алу.' },
    { title: 'Жұмыс істейтін азаматтар', description: 'Еңбек, жұмыс және келісім мәселелері бойынша кеңес.' },
    { title: 'Шағын бизнес иелері', description: 'Келісімшарт, ИП және бизнес құжаттарымен жұмыс.' },
    { title: 'Кез келген азамат', description: 'Өз құқықтарын білуге және қорғауға мүдделі адамдар.' },
  ],
  swot: [
    { letter: 'S', title: 'Күшті жақтары', text: 'Инновациялық идея, жоғары сұраныс және ыңғайлы цифрлық формат.' },
    { letter: 'W', title: 'Әлсіз жақтары', text: 'Бастапқы қаржы қажет, алғашқы қолданушыларды тарту керек.' },
    { letter: 'O', title: 'Мүмкіндіктер', text: 'Бүкіл Қазақстан бойынша дамыту, бизнеске арнайы қызмет ұсыну.' },
    { letter: 'T', title: 'Қауіптер', text: 'Болашақта бәсекелестердің нарыққа кіруі мүмкін.' },
  ],
  revenue: [
    { title: 'Ақылы заңгер консультациясы', text: 'Пайдаланушылар онлайн заңгермен чат, аудио немесе видео арқылы жеке кеңес алады.' },
    { title: 'Премиум құжаттар және жазылым', text: 'Кеңейтілген шаблондар мен толық функционалдылық үшін ай сайынғы тариф.' },
    { title: 'Бизнес тариф', text: 'Кәсіпкерлер мен ШОБ үшін арнайы пакет: 1 000 қолданушы x 2 000 тг = 2 000 000 тг айлық кіріс.' },
  ],
  team: [
    { role: 'Жоба авторы', text: 'Жалпы басқару және стратегия' },
    { role: 'Заңгер', text: 'Заңдық мазмұн және кеңес' },
    { role: 'IT маман', text: 'Қосымша жасау және техникалық қолдау' },
    { role: 'Дизайнер', text: 'UI/UX дизайн және визуалдық шешімдер' },
  ],
  account: {
    name: 'Айдана Қ.',
    status: 'Тексерілген қолданушы',
    plan: 'Premium',
    nextPayment: '15 мамыр 2026',
    stats: [
      { label: 'Құжат', value: '12', text: 'сақталған файл' },
      { label: 'Сұрақ', value: '8', text: 'AI және заңгер тарихы' },
      { label: 'Кеңес', value: '3', text: 'онлайн консультация' },
    ],
    documents: [
      { title: 'Еңбек шарты', meta: 'PDF • 24 сәуір 2026' },
      { title: 'Тұтынушы шағымы', meta: 'DOCX • 21 сәуір 2026' },
      { title: 'Сенімхат үлгісі', meta: 'PDF • 18 сәуір 2026' },
    ],
    questions: [
      { title: 'Жұмыстан босату кезінде қандай құқықтарым бар?', meta: 'AI жауап • бүгін' },
      { title: 'Айыппұлды қалай тексеремін?', meta: 'Жылдам кеңес • кеше' },
      { title: 'ИП ашу үшін қандай құжат керек?', meta: 'Заңгер чаты • 19 сәуір 2026' },
    ],
    actions: [
      { title: 'Жаңа құжат жасау', description: 'Шаблон таңдап, деректерді толтырыңыз.' },
      { title: 'Заңгерге жазылу', description: 'Чат, аудио немесе видео кеңес уақытын таңдаңыз.' },
      { title: 'Жазылымды басқару', description: 'Тариф, төлем және Premium мүмкіндіктерін бақылаңыз.' },
    ],
  },
  subscriptions: [
    {
      name: 'Basic',
      price: '0 тг',
      description: 'Құқықтық ақпаратпен танысуға және негізгі бөлімдерді көруге арналған.',
      featured: false,
      sections: ['Құқықтық білім', 'Жаңалықтар', 'AI заң кеңесшісі: шектеулі сұрақ', 'Жеке кабинет: негізгі тарих'],
    },
    {
      name: 'Premium',
      price: '2 000 тг / ай',
      description: 'Жеке қолданушыларға толық құқықтық қолдау және құжаттармен жұмыс.',
      featured: true,
      sections: ['AI заң кеңесшісі: толық қолжетімділік', 'Құжаттар шаблоны', 'Айыппұл тексеру', 'Аноним шағым', 'Онлайн заңгерге жазылу', 'Жеке кабинет және құжат сақтау'],
    },
    {
      name: 'Business',
      price: 'келісім бойынша',
      description: 'Кәсіпкерлер мен шағын бизнеске келісімшарт, ИП және команда құжаттары.',
      featured: false,
      sections: ['Бизнеске көмек', 'Келісімшарт тексеру', 'Премиум құжаттар', 'Онлайн заңгер', 'Командаға арналған кабинет', 'Басым техникалық қолдау'],
    },
  ],
};

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/api/health') {
      return sendJSON(res, 200, { status: 'ok' });
    }

    if (url.pathname === '/api/content') {
      return sendJSON(res, 200, content);
    }

    if (url.pathname === '/api/register') {
      return handleRegister(req, res);
    }

    if (url.pathname === '/api/login') {
      return handleLogin(req, res);
    }

    if (url.pathname === '/api/plan') {
      return handlePlan(req, res);
    }

    if (url.pathname === '/api/ai-chat') {
      return handleAIChat(req, res);
    }

    if (url.pathname === '/api/users') {
      return sendJSON(res, 200, [...users.values()].map(publicUser));
    }

    return serveStatic(url.pathname, res);
  } catch (error) {
    console.error(error);
    return sendJSON(res, 500, { error: 'Internal server error' });
  }
});

server.listen(port, () => {
  console.log(`ZanHelp Node backend listening on http://localhost:${port}`);
});

async function handleRegister(req, res) {
  if (req.method !== 'POST') return sendJSON(res, 405, { error: 'Method not allowed' });

  const body = await readJSON(req);
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!name || !email || password.length < 6) {
    return sendJSON(res, 400, { error: 'name, email and password with at least 6 characters are required' });
  }

  if (users.has(email)) {
    return sendJSON(res, 409, { error: 'user already exists' });
  }

  const user = {
    id: users.size + 1,
    name,
    email,
    password,
    plan: 'Жазылым жоқ',
    createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  users.set(email, user);
  return sendJSON(res, 201, publicUser(user));
}

async function handleLogin(req, res) {
  if (req.method !== 'POST') return sendJSON(res, 405, { error: 'Method not allowed' });

  const body = await readJSON(req);
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const user = users.get(email);

  if (!user || user.password !== password) {
    return sendJSON(res, 401, { error: 'email or password is incorrect' });
  }

  return sendJSON(res, 200, publicUser(user));
}

async function handlePlan(req, res) {
  if (req.method !== 'POST') return sendJSON(res, 405, { error: 'Method not allowed' });

  const body = await readJSON(req);
  const email = String(body.email || '').trim().toLowerCase();
  const plan = String(body.plan || '').trim();
  const user = users.get(email);

  if (!email || !plan) {
    return sendJSON(res, 400, { error: 'email and plan are required' });
  }

  if (!user) {
    return sendJSON(res, 404, { error: 'user not found' });
  }

  user.plan = plan;
  users.set(email, user);
  return sendJSON(res, 200, publicUser(user));
}

async function handleAIChat(req, res) {
  if (req.method !== 'POST') return sendJSON(res, 405, { error: 'Method not allowed' });

  const body = await readJSON(req);
  const message = String(body.message || '').trim();
  if (!message) {
    return sendJSON(res, 400, { error: 'message is required' });
  }

  return sendJSON(res, 200, { reply: getPreparedLegalReply(message) });
}

function getPreparedLegalReply(message) {
  const normalized = message.toLowerCase();

  if (normalized.includes('жұмыс') || normalized.includes('еңбек') || normalized.includes('жумыстан')) {
    return 'Егер жұмыстан шығару бойынша мәселе болса, алдымен еңбек шартыңызды, бұйрықты және жұмыс берушінің жазбаша хабарламасын тексеріңіз. Заңсыз деп ойласаңыз, еңбек инспекциясына немесе сотқа шағым беруге болады. Бұл жалпы ақпарат, нақты жағдай үшін заңгермен кеңескен дұрыс.';
  }

  if (normalized.includes('айып') || normalized.includes('штраф') || normalized.includes('shtraf') || normalized.includes('aiyppul')) {
    return 'Айыппұл бойынша қаулы нөмірін, күнін және төлеу мерзімін қараңыз. Егер айыппұлмен келіспесеңіз, қаулыны алған күннен бастап белгіленген мерзім ішінде шағым беруге болады. Дәлел ретінде фото, видео немесе құжаттарды сақтап қойыңыз.';
  }

  if (normalized.includes('келісім') || normalized.includes('шарт') || normalized.includes('договор')) {
    return 'Келісімшартқа қол қоймас бұрын тараптар, төлем, мерзім, жауапкершілік, айыппұл және шартты бұзу тәртібі нақты жазылғанын тексеріңіз. Түсініксіз тармақ болса, қол қоймай тұрып заңгерге көрсеткен дұрыс.';
  }

  return 'Мен әзірге 3 дайын тақырып бойынша жауап беремін: жұмыстан шығару, айыппұл және келісімшарт. Сұрағыңызды осы тақырыптардың бірімен нақтылап жазыңыз.';
}

async function serveStatic(requestPath, res) {
  if (!existsSync(distDir)) {
    return sendText(res, 404, 'frontend/dist not found. Run npm run build first.');
  }

  const safePath = path.normalize(decodeURIComponent(requestPath)).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(distDir, safePath === '/' ? 'index.html' : safePath);

  if (!filePath.startsWith(distDir)) {
    return sendText(res, 403, 'Forbidden');
  }

  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const data = await readFile(filePath);
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  res.end(data);
}

function readJSON(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        req.destroy();
        reject(new Error('request body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function publicUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function sendJSON(res, status, value) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(value));
}

function sendText(res, status, value) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(value);
}
