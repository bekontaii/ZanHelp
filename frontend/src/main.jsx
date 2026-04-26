import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CalendarCheck,
  Check,
  CreditCard,
  Download,
  FileText,
  Gavel,
  Lock,
  LogIn,
  LogOut,
  MessageCircle,
  Newspaper,
  Plus,
  Scale,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  Video,
} from 'lucide-react';
import './styles.css';

const iconMap = {
  'AI заң кеңесшісі': Sparkles,
  'Құжаттар шаблоны': FileText,
  'Онлайн заңгер': Video,
  'Құқықтық білім': BookOpen,
  'Бизнеске көмек': BriefcaseBusiness,
  'Айыппұл тексеру': Gavel,
  'Аноним шағым': Lock,
  Жаңалықтар: Newspaper,
  'Жеке кабинет': UserRound,
  'Жаңа құжат жасау': Plus,
  'Заңгерге жазылу': CalendarCheck,
  'Жазылымды басқару': Settings,
};

const fallbackContent = {
  features: [],
  tools: [],
  market: [],
  audience: [],
  swot: [],
  revenue: [],
  team: [],
  subscriptions: [],
  account: {
    stats: [],
    documents: [],
    questions: [],
    actions: [],
  },
};

const serviceDetails = {
  'AI заң кеңесшісі': ['Еңбек, отбасы, айыппұл және тұтынушы құқығы бойынша жылдам жауап береді.', 'Қарапайым тілмен түсіндіреді және келесі қадамды ұсынады.', 'Сұрақтар тарихы жеке кабинетте сақталады.'],
  'Құжаттар шаблоны': ['Арыз, шағым, сенімхат және келісімшарт үлгілерін дайындайды.', 'Пайдаланушы деректерін енгізгеннен кейін дайын файл алуға болады.', 'Premium тарифінде кеңейтілген шаблондар ашылады.'],
  'Онлайн заңгер': ['Чат, аудио немесе видео арқылы заңгермен байланыс.', 'Кеңес уақытын алдын ала таңдау мүмкіндігі.', 'Premium және Business тарифтеріне ыңғайлы.'],
  'Құқықтық білім': ['Заң терминдерін қысқа әрі түсінікті форматта үйретеді.', 'Тест сұрақтары арқылы құқықтық сауаттылықты арттырады.', 'Basic тарифінде де қолжетімді негізгі бөлім.'],
  'Бизнеске көмек': ['ИП ашу, келісімшарт тексеру және бизнес құжаттар.', 'Кәсіпкерлерге арнайы құқықтық пакет.', 'Business тарифінде толық ашылады.'],
  'Айыппұл тексеру': ['ЖСН немесе көлік нөмірі арқылы айыппұл бар-жоғын тексеру.', 'Нәтижені жеке кабинет тарихында сақтау.', 'Premium тарифіндегі пайдалы жылдам құрал.'],
  'Аноним шағым': ['Заң бұзушылық туралы аты-жөніңізді көрсетпей хабарлау.', 'Дәлел файлдарын жүктеу сценарийі.', 'Қауіпсіз әрі түсінікті жіберу процесі.'],
  Жаңалықтар: ['Жаңа заңдар мен өзгерістерді бақылау.', 'Күнделікті өмірге пайдалы құқықтық кеңестер.', 'Basic тарифінде қолжетімді ақпараттық бөлім.'],
  'Жеке кабинет': ['Құжаттарды, сұрақтар тарихын және жазылымды сақтау.', 'Тарифті басқару және қызметтерге жылдам өту.', 'Тіркелген қолданушыға арналған негізгі орталық.'],
};

function slugify(text) {
  return encodeURIComponent(text.toLowerCase().replace(/\s+/g, '-'));
}

function unslug(slug) {
  return decodeURIComponent(slug).replace(/-/g, ' ');
}

function App() {
  const [content, setContent] = useState(fallbackContent);
  const [route, setRoute] = useState(window.location.pathname);
  const [currentUser, setCurrentUser] = useState(() => {
    const raw = localStorage.getItem('zanhelp-user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    fetch('/api/content')
      .then((response) => response.json())
      .then(setContent)
      .catch(() => setContent(fallbackContent));
  }, []);

  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveUser = (user) => {
    localStorage.setItem('zanhelp-user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const registerUser = async (payload) => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Тіркелу қатесі');
    }
    const user = await response.json();
    saveUser(user);
    navigate('/account');
  };

  const loginUser = async (payload) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Кіру қатесі');
    }
    const user = await response.json();
    saveUser(user);
    navigate('/account');
  };

  const updatePlan = async (plan) => {
    if (!currentUser) {
      navigate('/register');
      return;
    }
    const response = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentUser.email, plan }),
    });
    if (!response.ok) {
      throw new Error((await response.text()) || 'Тарифті өзгерту қатесі');
    }
    saveUser(await response.json());
    navigate('/account');
  };

  const logout = () => {
    localStorage.removeItem('zanhelp-user');
    setCurrentUser(null);
    navigate('/login');
  };

  const page = useMemo(() => {
    if (route.startsWith('/service/')) {
      return <ServiceDetailPage content={content} route={route} navigate={navigate} />;
    }

    switch (route) {
      case '/services':
        return <ServicesPage content={content} navigate={navigate} />;
      case '/subscriptions':
        return <SubscriptionsPage content={content} user={currentUser} navigate={navigate} onChoosePlan={updatePlan} />;
      case '/account':
        return <AccountPage account={content.account} user={currentUser} navigate={navigate} />;
      case '/register':
        return <RegisterPage onSubmit={registerUser} navigate={navigate} />;
      case '/login':
        return <LoginPage onSubmit={loginUser} navigate={navigate} />;
      default:
        return <HomePage content={content} navigate={navigate} />;
    }
  }, [route, content, currentUser]);

  return (
    <main>
      <Header navigate={navigate} route={route} user={currentUser} onLogout={logout} />
      {page}
    </main>
  );
}

function Header({ navigate, route, user, onLogout }) {
  const links = [
    ['/', 'Басты бет'],
    ['/services', 'Қызметтер'],
    ['/subscriptions', 'Жазылым'],
    ['/account', 'Кабинет'],
  ];

  return (
    <header className="topbar">
      <button className="brand" type="button" onClick={() => navigate('/')} aria-label="ZanHelp басты беті">
        <Scale size={24} aria-hidden="true" />
        <span>ZanHelp</span>
      </button>
      <nav aria-label="Негізгі навигация">
        {links.map(([path, label]) => (
          <button className={route === path ? 'active' : ''} type="button" onClick={() => navigate(path)} key={path}>
            {label}
          </button>
        ))}
      </nav>
      <div className="auth-actions">
        {user ? (
          <>
            <button className="nav-cta" type="button" onClick={() => navigate('/account')}>
              <UserRound size={17} aria-hidden="true" />
              {user.name}
            </button>
            <button className="icon-action" type="button" onClick={onLogout} aria-label="Аккаунттан шығу">
              <LogOut size={18} aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            <button className="secondary-nav" type="button" onClick={() => navigate('/login')}>
              <LogIn size={17} aria-hidden="true" />
              Кіру
            </button>
            <button className="nav-cta" type="button" onClick={() => navigate('/register')}>
              <UserRound size={17} aria-hidden="true" />
              Тіркелу
            </button>
          </>
        )}
      </div>
    </header>
  );
}

function HomePage({ content, navigate }) {
  return (
    <>
      <section className="hero page-hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">Құқықтық көмек бір қосымшада</p>
          <h1>ZanHelp</h1>
          <p>
            Заң қызметтерін бір мобильді қосымшаға біріктіретін қазақстандық legal-tech платформа:
            AI кеңесші, құжат шаблондары, онлайн заңгер және жеке кабинет.
          </p>
          <div className="hero-actions">
            <button className="primary-action" type="button" onClick={() => navigate('/register')}>
              Тіркелу
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button className="secondary-action" type="button" onClick={() => navigate('/subscriptions')}>
              Жазылымдар
            </button>
          </div>
        </div>
        <div className="hero-panel">
          <img src="/zanhelp-hero.png" alt="ZanHelp қосымшасының құқықтық көмек интерфейсі" />
        </div>
      </section>

      <section className="section compact-section">
        <SectionTitle
          eyebrow="Негізгі мүмкіндіктер"
          title="Керек заң көмегін бірнеше бетке бөліп, ыңғайлы қолдануға болады"
          text="Қызметтер, жазылым, жеке кабинет және жоба туралы мәлімет енді бөлек беттерге бөлінді."
        />
        <div className="feature-grid">
          {content.features.slice(0, 5).map((item) => (
            <InfoCard item={item} key={item.title} onClick={() => navigate(`/service/${slugify(item.title)}`)} />
          ))}
        </div>
      </section>
    </>
  );
}

function ServicesPage({ content, navigate }) {
  return (
    <PageFrame eyebrow="Қызметтер" title="ZanHelp бөлімдері" text="Әр бөлім қолданушының нақты құқықтық қажеттілігіне бағытталған.">
      <div className="feature-grid">
        {content.features.map((item) => (
          <InfoCard item={item} key={item.title} onClick={() => navigate(`/service/${slugify(item.title)}`)} />
        ))}
      </div>
      <div className="tool-grid section-gap">
        {content.tools.map((item) => (
          <InfoCard item={item} key={item.title} compact onClick={() => navigate(`/service/${slugify(item.title)}`)} />
        ))}
      </div>
      <div className="action-strip">
        <div>
          <h2>Қызметтерді толық пайдалану үшін жазылым таңдаңыз</h2>
          <p>Premium және Business тарифтері құжаттар, онлайн заңгер және кабинет мүмкіндіктерін ашады.</p>
        </div>
        <button className="primary-action" type="button" onClick={() => navigate('/subscriptions')}>
          Жазылымға өту
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </PageFrame>
  );
}

function ServiceDetailPage({ content, route, navigate }) {
  const title = unslug(route.replace('/service/', ''));
  const allItems = [...content.features, ...content.tools];
  const item = allItems.find((entry) => entry.title.toLowerCase() === title) || allItems[0];
  const details = serviceDetails[item?.title] || ['Бұл бөлім ZanHelp ішіндегі құқықтық көмек сценарийіне арналған.', 'Қызметті толық пайдалану үшін жеке кабинет пен жазылымды қосуға болады.'];
  const Icon = iconMap[item?.title] || MessageCircle;

  if (!item) {
    return (
      <PageFrame eyebrow="Қызмет" title="Бөлім табылмады" text="Қызметтер бетіне қайтып, қажетті бөлімді таңдаңыз.">
        <button className="primary-action" type="button" onClick={() => navigate('/services')}>
          Қызметтерге оралу
        </button>
      </PageFrame>
    );
  }

  const isAIAdvisor = item.title === 'AI заң кеңесшісі';

  return (
    <PageFrame eyebrow="Қызмет" title={item.title} text={item.description} centered>
      <div className={isAIAdvisor ? 'service-detail centered-detail ai-only-detail' : 'service-detail centered-detail'}>
        {isAIAdvisor ? (
          <AIChat />
        ) : (
          <>
            <div className="service-icon">
              <Icon size={34} aria-hidden="true" />
            </div>
            <div className="detail-list">
              {details.map((detail) => (
                <article key={detail}>
                  <Check size={18} aria-hidden="true" />
                  <span>{detail}</span>
                </article>
              ))}
            </div>
            <div className="hero-actions">
              <button className="primary-action" type="button" onClick={() => navigate('/subscriptions')}>
                Жазылымды көру
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <button className="secondary-action" type="button" onClick={() => navigate('/services')}>
                Барлық қызметтер
              </button>
            </div>
          </>
        )}
      </div>
    </PageFrame>
  );
}

function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Сәлем! Құқықтық сұрағыңызды жазыңыз. Мысалы: жұмыстан шығару, айыппұл, алимент, келісімшарт немесе тұтынушы құқығы.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const suggestions = ['Жұмыстан заңсыз шығарса не істеймін?', 'Айыппұлға қалай шағым беремін?', 'Келісімшартта нені тексеру керек?'];

  const sendMessage = async (text = input) => {
    const message = text.trim();
    if (!message || loading) {
      return;
    }

    setInput('');
    setLoading(true);
    setMessages((items) => [...items, { role: 'user', text: message }]);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      setMessages((items) => [...items, { role: 'ai', text: data.reply }]);
    } catch {
      setMessages((items) => [
        ...items,
        { role: 'ai', text: 'Қазір жауап алу мүмкін болмады. Сәл кейін қайталап көріңіз.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ai-chat" aria-label="AI заң кеңесшісі чаты">
      <div className="chat-header">
        <div>
          <p className="eyebrow">AI чат</p>
          <h3>Сұрағыңызды жазыңыз</h3>
        </div>
        <Sparkles size={24} aria-hidden="true" />
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <article className={message.role === 'user' ? 'chat-bubble user' : 'chat-bubble ai'} key={`${message.role}-${index}`}>
            {message.text}
          </article>
        ))}
        {loading ? <article className="chat-bubble ai">Жауап дайындалып жатыр...</article> : null}
      </div>
      <div className="chat-suggestions">
        {suggestions.map((item) => (
          <button type="button" onClick={() => sendMessage(item)} key={item}>
            {item}
          </button>
        ))}
      </div>
      <form
        className="chat-form"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Мысалы: айыппұл келді, не істеймін?" />
        <button className="primary-action" type="submit" disabled={loading}>
          Жіберу
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}

function SubscriptionsPage({ content, user, navigate, onChoosePlan }) {
  const sections = [
    ...content.features.map((item) => item.title),
    ...content.tools.map((item) => item.title),
  ];
  const planRank = { Basic: 0, Premium: 1, Business: 2 };
  const hasPlan = user && Object.prototype.hasOwnProperty.call(planRank, user.plan);
  const currentRank = hasPlan ? planRank[user.plan] : -1;
  const visiblePlans = user
    ? content.subscriptions.filter((plan) => (planRank[plan.name] ?? 0) > currentRank)
    : content.subscriptions;
  const pageTitle = user
    ? !hasPlan
      ? 'Жазылымды сатып алыңыз'
      : user.plan === 'Business'
      ? 'Сізде ең толық Business тарифі қосылған'
      : `${user.plan} тарифінен кейінгі қолжетімді ұсыныстар`
    : 'ZanHelp тарифтері және бөлімдерге қолжетімділік';
  const pageText = user
    ? !hasPlan
      ? 'Аккаунт ашылды, енді қажетті тарифті осы беттен сатып алуға болады.'
      : user.plan === 'Basic'
      ? 'Basic аккаунт үшін Premium және Business мүмкіндіктерін ұсынамыз.'
      : user.plan === 'Premium'
        ? 'Premium аккаунт үшін келесі қадам ретінде Business тарифін ұсынамыз.'
        : 'Барлық негізгі бөлімдер Business тарифінде толық ашылған.'
    : 'Аккаунтқа кірмеген қолданушы барлық тарифті салыстыра алады.';

  return (
    <PageFrame
      eyebrow="Жазылым"
      title={pageTitle}
      text={pageText}
    >
      {visiblePlans.length ? (
        <div className="plans-grid">
          {visiblePlans.map((plan) => (
          <article className={plan.featured ? 'plan-card featured' : 'plan-card'} key={plan.name}>
            <span>{plan.name}</span>
            <strong>{plan.price}</strong>
            <p>{plan.description}</p>
            <ul>
              {plan.sections.map((item) => (
                <li key={item}>
                  <Check size={16} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <button className={plan.featured ? 'primary-action' : 'secondary-action'} type="button" onClick={() => (user ? onChoosePlan(plan.name) : navigate('/register'))}>
              {user ? 'Сатып алу' : 'Тіркеліп сатып алу'}
            </button>
          </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <CreditCard size={42} aria-hidden="true" />
          <h2>Жоғары тариф жоқ</h2>
          <p>Business тарифі барлық ZanHelp бөлімдерін және басым қолдауды қамтиды.</p>
          <button className="secondary-action" type="button" onClick={() => navigate('/account')}>
            Кабинетке өту
          </button>
        </div>
      )}

      <section className="section-subblock">
        <SectionTitle
          eyebrow="Бөлімдер"
          title="Жазылым ішінде қамтылатын ZanHelp бөлімдері"
          text="Бұл тізім сайттағы барлық негізгі сервистерді көрсетеді."
        />
        <div className="access-grid">
          {sections.map((item) => (
            <article key={item}>
              <Check size={18} aria-hidden="true" />
              <span>{item}</span>
            </article>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}

function AccountPage({ account, user, navigate }) {
  if (!user) {
    return (
      <PageFrame eyebrow="Жеке кабинет" title="Кабинетке кіру үшін тіркеліңіз" text="Тіркелгеннен кейін құжаттар, сұрақтар тарихы және жазылым бір жерде сақталады.">
        <div className="empty-state">
          <UserRound size={42} aria-hidden="true" />
          <h2>Әзірге аккаунт жоқ</h2>
          <p>In-memory тіркелу қосылды: сервер жұмыс істеп тұрған кезде қолданушы деректері сақталады.</p>
          <button className="primary-action" type="button" onClick={() => navigate('/register')}>
            Тіркелу
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <button className="secondary-action" type="button" onClick={() => navigate('/login')}>
            Кіру
          </button>
        </div>
      </PageFrame>
    );
  }

  return (
    <PageFrame eyebrow="Жеке кабинет" title="Құжаттар, сұрақтар тарихы және жазылым бір жерде" text="Пайдаланушы құқықтық материалдарын сақтап, Premium мүмкіндіктерін басқара алады.">
      <div className="account-shell">
        <aside className="account-sidebar">
          <div className="profile-badge">
            <div className="avatar" aria-hidden="true">
              <UserRound size={28} />
            </div>
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>
          <div className="plan-box">
            <span>Тариф</span>
            <strong>{user.plan}</strong>
            <p>Тіркелген уақыт: {user.createdAt}</p>
            <button type="button" onClick={() => navigate('/subscriptions')}>
              <CreditCard size={18} aria-hidden="true" />
              Тарифті өзгерту
            </button>
          </div>
        </aside>

        <div className="account-main">
          <div className="account-stats">
            {account.stats.map((item) => (
              <article key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <div className="account-columns">
            <AccountList title="Сақталған құжаттар" icon={FileText} items={account.documents} actionIcon={Download} />
            <AccountList title="Сұрақтар тарихы" icon={MessageCircle} items={account.questions} />
          </div>
          <div className="quick-actions">
            {account.actions.map((item) => (
              <InfoCard item={item} key={item.title} compact />
            ))}
          </div>
        </div>
      </div>
    </PageFrame>
  );
}

function LoginPage({ onSubmit, navigate }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setStatus('Тексерілуде...');
    try {
      await onSubmit(form);
    } catch (error) {
      setStatus(error.message.trim());
    }
  };

  return (
    <PageFrame eyebrow="Кіру" title="ZanHelp аккаунтына кіру" text="Бұрын тіркелген email және құпиясөз арқылы кабинетке кіріңіз.">
      <form className="register-form" onSubmit={submit}>
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
        </label>
        <label>
          Құпиясөз
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="құпиясөз" />
        </label>
        <div className="form-actions">
          <button className="primary-action" type="submit">
            Кіру
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <button className="secondary-action" type="button" onClick={() => navigate('/register')}>
            Тіркелу
          </button>
        </div>
        {status ? <p className="form-status">{status}</p> : null}
      </form>
    </PageFrame>
  );
}

function RegisterPage({ onSubmit, navigate }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setStatus('Жіберілуде...');
    try {
      await onSubmit(form);
    } catch (error) {
      setStatus(error.message.trim());
    }
  };

  return (
    <PageFrame eyebrow="Тіркелу" title="ZanHelp аккаунтын ашу" text="Аккаунт тарифсіз ашылады. Basic, Premium немесе Business жазылымын кейін Жазылым бетінде сатып аласыз.">
      <form className="register-form" onSubmit={submit}>
        <label>
          Аты-жөні
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Мысалы: Айдана Қ." />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
        </label>
        <label>
          Құпиясөз
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="кемінде 6 таңба" />
        </label>
        <div className="form-actions">
          <button className="primary-action" type="submit">
            Аккаунт ашу
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <button className="secondary-action" type="button" onClick={() => navigate('/login')}>
            Кіру
          </button>
        </div>
        {status ? <p className="form-status">{status}</p> : null}
      </form>
    </PageFrame>
  );
}

function PageFrame({ eyebrow, title, text, children, centered = false }) {
  return (
    <section className={centered ? 'page centered-page' : 'page'}>
      <SectionTitle eyebrow={eyebrow} title={title} text={text} />
      {children}
    </section>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="section-title">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function AccountList({ title, icon: Icon, items, actionIcon: ActionIcon }) {
  return (
    <article className="account-list">
      <div className="list-heading">
        <Icon size={20} aria-hidden="true" />
        <h3>{title}</h3>
      </div>
      {items.map((item) => (
        <div className="account-row" key={item.title}>
          <div>
            <strong>{item.title}</strong>
            <span>{item.meta}</span>
          </div>
          {ActionIcon ? (
            <button type="button" aria-label={`${item.title} жүктеу`}>
              <ActionIcon size={17} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ))}
    </article>
  );
}

function InfoCard({ item, compact = false, onClick }) {
  const Icon = iconMap[item.title] || MessageCircle;
  const Tag = onClick ? 'button' : 'article';
  return (
    <Tag className={compact ? 'info-card compact' : 'info-card'} type={onClick ? 'button' : undefined} onClick={onClick}>
      <div className="icon-wrap">
        <Icon size={22} aria-hidden="true" />
      </div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </Tag>
  );
}

createRoot(document.getElementById('root')).render(<App />);
