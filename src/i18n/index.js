import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    hero: {
      title: 'Donatas & Trang Wedding',
      date: '05-04-2026',
      location: 'Hanoi, Vietnam',
      greeting_hello: 'Hello',
      greeting_vietnamese: 'Xin Chào',
      greeting_lithuanian: 'Labas',
      invitation: 'We warmly invite you to our wedding in the land of lotus lakes and golden paddies.',
      primary_button: "I'll come",
      secondary_button: 'A Few Questions for You',
      questions_answered: 'Questions answered :)',
      reveal_address: 'Reveal venue address',
      after_accept: 'Wonderful! I cannot wait to see you in Vietnam 🌸🌿💍',
      after_questions: 'Thank you for answering the questions, now it is really time to start planning your trip. Check the recommendations of what to do in Vietnam below.',
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
      available_after: 'Available after November 1st',
      link_soon: 'Link available soon',
    },
    modal: {
      title: 'A Few Questions for You',
      ticket_date: 'When are you planning to buy tickets?',
      has_plus_one: 'Will there be a plus one with you?',
      days_staying: 'How many days are you planning to stay in Vietnam?',
      additional_message: 'Any other message?',
      yes: 'Yes',
      no: 'No',
      save: 'Save',
      cancel: 'Cancel',
      errors: {
        required: 'This field is required',
        positive: 'Please enter a positive number',
      }
    },
    address: {
      title: 'Venue Address',
      venue: 'Lotus Garden, West Lake',
      city: 'Hanoi, Vietnam',
    }
  },
  lt: {
    hero: {
      title: 'Donato ir Trang Vestuvės',
      date: '05-04-2026',
      location: 'Hanojus, Vietnamas',
      greeting_hello: 'Labas',
      greeting_vietnamese: 'Xin Chào',
      greeting_lithuanian: 'Labas',
      invitation: 'Šiltai kviečiame jus į mūsų vestuves lotosų ežerų ir auksinių ryžių laukų žemėje.',
      primary_button: 'Aš ateisiu',
      secondary_button: 'Čekleta klausimų tau',
      questions_answered: 'Į klausimus atsakyta :)',
      reveal_address: 'Atskleisti vietos adresą',
      after_accept: 'Nuostabu! Negaliu sulaukti, kada tave pamatysiu Vietname 🌸🌿💍',
      after_questions: 'Ačiū už atsakymus į klausimus, dabar tikrai laikas pradėti planuoti kelionę. Žemiau patikrink rekomendacijas, ką veikti Vietname.',
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
      vietnam_info: 'Spausk čia, kad sužinotum, kas tavęs laukia Vietname?',
      tickets_info: 'Kada geriausia pirkti bilietus?',
      available_after: 'Prieinama po lapkričio 1 d.',
      link_soon: 'Nuoroda greitai',
    },
    modal: {
      title: 'Čekleta klausimų tau',
      ticket_date: 'Kada planuoji pirkti bilietus?',
      has_plus_one: 'Ar su savimi turėsi dar vieną žmogų?',
      days_staying: 'Kiek dienų planuoji likti Vietname?',
      additional_message: 'Ar turi dar kokių žinučių man?',
      yes: 'Taip',
      no: 'Ne',
      save: 'Išsaugoti',
      cancel: 'Atšaukti',
      errors: {
        required: 'Šis laukas yra privalomas',
        positive: 'Prašome įvesti teigiamą skaičių',
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
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})
