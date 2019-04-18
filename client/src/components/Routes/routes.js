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

const routes = [
  {
    comp: "start",
    path: "/start",
    component: Start
    // title: "Start"
  },
  {
    comp: "bonus_system",
    path: "/users_channels",
    component: UsersChannels
    // title: "Dodaj koszty"
  },
  {
    comp: "costs",
    path: "/costs",
    component: Costs
    // title: "Dodaj koszty"
  },
  {
    comp: "planer",
    path: "/planer",
    component: Planer
    // title: "Zaplanuj aktywności"
  },
  {
    comp: "raporty",
    path: "/raporty",
    component: PlanerRaport
    // title: "Dodaj raport z aktywności"
  },
  {
    comp: "nextReports",
    path: "/nextreports",
    component: NextReports
    // title: ""
  },
  // {
  //   comp: "serwis",
  //   path: "/serwis",
  //   component: Serwis,
  //   title: "Dodaj transakcję dla serwisu",
  //   channel: auth ? auth.channel_first : 0
  // },
  {
    comp: "bonus_system",
    path: "/channelconfiguration",
    component: ChanProdConf,
    title: "Skonfiguruj kanały sprzedaży"
    //channel: auth ? auth.channel_first : 0
  },
  {
    comp: "bonus_system",
    path: "/products",
    component: Products,
    title: "Produkty"
    //channel: auth ? auth.channel_first : 0
  },
  {
    comp: "users",
    path: "/users",
    component: Users
    // title: "Użytkownicy"
    //channel: auth ? auth.channel_first : 0
  },
  {
    comp: "bonus_system",
    path: "/systems",
    component: Channels
    // title: "Systemy prowizyjne"
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
    component: Invoices
    // title: "Zaległe faktury"
    //channel: auth ? auth.channel_first : 0
  },
  {
    comp: "customer_details",
    path: "/customerdetails",
    component: CustomerDetails,
    // title: "Informacje o klientach",
    open: true
    //channel: auth ? auth.channel_first : 0
  },
  {
    comp: "calculators",
    path: "/calculators",
    component: Calculators
    // title: "Kalkulatory"
    // open: true
    //channel: auth ? auth.channel_first : 0
  }
];

export default routes;
