const helpers = require('../helpers')

describe('parseSignUpToVolunteer:', () => {
  it('output matches expected schema', () => {
    const input = {
      availability: ['Monday', 'Tuesday'],
      data_privacy_consent: "I consent to be contacted by my local Mutual Aid volunteer groups to join the local volunteer response to COVID-19 pandemic.",
      discord: "discord.com",
      email: "name@email.com",
      facebook: "facebook.com",
      name: "MikeMike",
      owns_car: false,
      postcode: "NW1 1Q1",
      roles: ["Mutual aid group admin","Local councilor"],
      whatsapp: "whatsapp.com",
      services_offered: "groceries,medicine",
      spoken_languages: "swahili,french",
      telegram: "telegram.com"
    }
    const signUpId = 'yuighjb'
    const expected = {
      availability: input.availability,
      email: input.email,
      name: input.name,
      owns_car: input.owns_car,
      postcode: input.postcode,
      roles: input.roles,
      services_offered: input.services_offered,
      spoken_languages: input.spoken_languages,
      group_links: {
        whatsapp: input.whatsapp,
        facebook: input.facebook,
        telegram: input.telegram,
        discord: input.discord,
      },
      signup_id: signUpId
    }
    const result = helpers.parseSignUpToVolunteer(input,signUpId)
    expect(result).toEqual(expected)
  })
})
