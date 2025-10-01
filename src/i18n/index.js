import { createI18n } from 'vue-i18n'

const messages = {
  EN: {
    hero: {
      title: 'Donatas & Trang Wedding',
      date: '5 April 2026',
      location: 'Hanoi, Vietnam',
      greeting_hello: 'Hello',
      greeting_vietnamese: 'Xin Chào',
      greeting_lithuanian: 'Labas',
      invitation: 'we warmly invite you to our wedding in the land of lotus lakes and golden paddies.',
      primary_button: "I'll come",
      secondary_button: 'Unfortunately no',
      morphed_button: 'Satisfy my curiosity',
      questions_answered: 'Questions answered :)',
      reveal_address: 'Reveal venue address',
      after_accept: 'We cannot wait to see you at our wedding...',
      after_questions: 'Thank you for answering my questions, feel free to explore the site.',
      reject_message: 'I am sorry to hear that, if your plans change - drop me a message!',
    },
    countdown: {
      months: 'Months',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
    },
    links: {
      vietnam_info: 'Click here to find out what is waiting for me in Viet Nam?',
      tickets_info: 'When is the best time to buy tickets?',
      available_from: 'Available from',
      coming_soon: 'Coming soon',
      flying_from: 'Flying from',
      set_country: 'Set your departure country in the form',
      will_show_soon: 'Will show soon',
    },
    modal: {
      title: 'Tell us more about your visit',
      days_in_vietnam: 'How many days will you stay in Vietnam?',
      flight_ticket_date: 'When do you plan to book your flight ticket?',
      days_before_wedding: 'How many days before the wedding will you arrive?',
      coming_with: 'Who are you coming with?',
      submit: 'Submit',
      cancel: 'Cancel',
      errors: {
        required: 'This field is required',
        positive: 'Please enter a positive number',
        future_date: 'Date must be in the future',
      }
    },
    address: {
      title: 'Venue Address',
      venue: 'Lotus Garden, West Lake',
      city: 'Hanoi, Vietnam',
    }
  },
  LT: {
    hero: {
      title: 'Donato ir Trang Vestuvės',
      date: '2026 m. balandžio 5 d.',
      location: 'Hanojus, Vietnamas',
      greeting_hello: 'Labas',
      greeting_vietnamese: 'Xin Chào',
      greeting_lithuanian: 'Labas',
      invitation: 'šiltai kviečiame jus į mūsų vestuves lotosų ežerų ir auksinių ryžių laukų žemėje.',
      primary_button: 'Aš ateit',
      secondary_button: 'Deja, ne',
      morphed_button: 'Patenkink mano smalsumą',
      questions_answered: 'Į klausimus atsakyta :)',
      reveal_address: 'Atskleisti vietos adresą',
      after_accept: 'Negalime sulaukti, kada jus pamatysime vestuvėse...',
      after_questions: 'Ačiū už atsakymus į klausimus, laisvai naršykite svetainę.',
      reject_message: 'Man liūdna tai girdėti, jei jūsų planai pasikeistų - parašykite man žinutę!',
    },
    countdown: {
      months: 'Mėnesiai',
      days: 'Dienos',
      hours: 'Valandos',
      minutes: 'Minutės',
      seconds: 'Sekundės',
    },
    links: {
      vietnam_info: 'Spustelėkite čia, kad sužinotumėte, kas manęs laukia Vietname?',
      tickets_info: 'Kada geriausia pirkti bilietus?',
      available_from: 'Prieinama nuo',
      coming_soon: 'Greitai',
      flying_from: 'Skrenda iš',
      set_country: 'Nustatykite išvykimo šalį formoje',
      will_show_soon: 'Netrukus parodysime',
    },
    modal: {
      title: 'Papasakokite daugiau apie savo vizitą',
      days_in_vietnam: 'Kiek dienų būsite Vietname?',
      flight_ticket_date: 'Kada planuojate rezervuoti skrydžio bilietą?',
      days_before_wedding: 'Kiek dienų prieš vestuves atvyksite?',
      coming_with: 'Su kuo atvykstate?',
      submit: 'Pateikti',
      cancel: 'Atšaukti',
      errors: {
        required: 'Šis laukas yra privalomas',
        positive: 'Prašome įvesti teigiamą skaičių',
        future_date: 'Data turi būti ateityje',
      }
    },
    address: {
      title: 'Vietos Adresas',
      venue: 'Lotosų Sodas, Vakarų Ežeras',
      city: 'Hanojus, Vietnamas',
    }
  }
}

export default createI18n({
  legacy: false,
  locale: 'EN',
  fallbackLocale: 'EN',
  messages,
})
