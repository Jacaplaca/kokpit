import Costs from "../Costs";
import Planer from "../Planer";
import PlanerRaport from "../PlanerRaporty";
import Login from "../Login";
import PromowaneProdukty from "../PromowaneProdukty";
import NextReports from "../NextReports";
// import Serwis from "./Serwis";
import ChanProdConf from "../ChanProdConf";
import Products from "../Products";
import Users from "../Users";
import Channels from "../Channels";
import ChannelsConfig from "../ChannelsConfig";
import Invoices from "../Invoices";
import CustomerDetails from "../CustomerDetails";
import Calculators from "../Calculators";
import Start from "../Start";
import UsersChannels from "../UsersChannels";
import Settings from "../Settings";
import PowerBI from "../PowerBI";
import BonusRules from "../BonusRules";
import DocumentsTransactions from "../DocumentsTransactions";

const routes = [
  {
    comp: "start",
    path: "/start",
    component: Start,
    id: 0,
    parrentId: 0
    // title: "Start"
  },
  {
    comp: "costs",
    path: "/costs",
    component: Costs,
    id: 8,
    parrentId: 8
    // title: "Dodaj koszty"
  },
  {
    comp: "planer_reports",
    path: "/planer",
    component: Planer,
    id: 17,
    parrentId: 24
    // title: "Zaplanuj aktywności"
  },
  {
    comp: "planer_reports",
    path: "/raporty",
    component: PlanerRaport,
    id: 3,
    parrentId: 24
    // title: "Dodaj raport z aktywności"
  },
  {
    comp: "nextReports",
    path: "/nextreports",
    component: NextReports,
    id: 4,
    parrentId: 4
    // title: ""
  },
  {
    comp: "powerBi",
    path: "/powerbi",
    component: PowerBI,
    id: 22,
    parrentId: 22
    // title: ""
  },
  // {
  //   comp: "serwis",
  //   path: "/serwis",
  //   component: Serwis,
  //   title: "Dodaj transakcję dla serwisu",
  //   channel: auth ? auth.channel_first : 0
  // },
  // {
  //   comp: "bonus_system",
  //   path: "/channelconfiguration",
  //   component: ChanProdConf,
  //   title: "Skonfiguruj kanały sprzedaży",
  //   id: 20
  //   //channel: auth ? auth.channel_first : 0
  // },
  {
    comp: "bonus_system",
    path: "/products",
    component: Products,
    id: 25,
    parrentId: 20
    // title: "Produkty"
    //channel: auth ? auth.channel_first : 0
  },
  {
    comp: "bonus_system",
    path: "/systems",
    component: Channels,
    id: 26,
    parrentId: 20
    // title: "Systemy prowizyjne"
    //channel: auth ? auth.channel_first : 0
  },
  {
    comp: "bonus_system",
    path: "/users_channels",
    component: UsersChannels,
    id: 27,
    parrentId: 20
    // id: 20
    // title: "Dodaj koszty"
  },
  {
    comp: "users",
    path: "/users",
    component: Users,
    id: 1,
    parrentId: 1
    // title: "Użytkownicy"
    //channel: auth ? auth.channel_first : 0
  },
  // {
  //   comp: "channels_config",
  //   path: "/configs",
  //   component: ChannelsConfig,
  //   title: "Konfiguracja systemów"
  //   //channel: auth ? auth.channel_first : 0
  // }
  {
    comp: "invoices",
    path: "/invoices",
    component: Invoices,
    id: 10,
    parrentId: 10
    // title: "Zaległe faktury"
    //channel: auth ? auth.channel_first : 0
  },
  {
    comp: "documents_transactions",
    path: "/documentstransactions",
    component: DocumentsTransactions,
    id: 28,
    parrentId: 28
    // title: "Zaległe faktury"
    //channel: auth ? auth.channel_first : 0
  },
  {
    comp: "customer_details",
    path: "/customerdetails",
    component: CustomerDetails,
    // title: "Informacje o klientach",
    // open: true,
    id: 12,
    parrentId: 12
    //channel: auth ? auth.channel_first : 0
  },
  {
    comp: "calculators",
    path: "/calculators",
    component: Calculators,
    id: 11,
    parrentId: 11
    // title: "Kalkulatory"
    // open: true
    //channel: auth ? auth.channel_first : 0
  },
  {
    comp: "settings",
    path: "/settings",
    component: Settings,
    id: 21,
    parrentId: 21
    // title: "Kalkulatory"
    // open: true
    //channel: auth ? auth.channel_first : 0
  },
  {
    comp: "bonusRules",
    path: "/bonusrules",
    component: BonusRules,
    id: 23,
    parrentId: 23
    // title: "Kalkulatory"
    // open: true
    //channel: auth ? auth.channel_first : 0
  }
];

export default routes;
