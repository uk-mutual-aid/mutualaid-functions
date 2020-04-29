const helpers = require('../helpers')

describe('parseSignUpToVolunteer:', () => {
  it('output matches expected schema', () => {
    const input = {
      availability: ['Monday', 'Tuesday'],
      data_privacy_consent:
        'I consent to be contacted by my local Mutual Aid volunteer groups to join the local volunteer response to COVID-19 pandemic.',
      discord: 'discord.com',
      email: 'name@email.com',
      facebook: 'facebook.com',
      name: 'MikeMike',
      owns_car: false,
      postcode: 'NW1 1Q1',
      roles: ['Mutual aid group admin', 'Local councilor'],
      whatsapp: 'whatsapp.com',
      services_offered: 'groceries,medicine',
      spoken_languages: 'swahili,french',
      telegram: 'telegram.com',
      id: 81
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
      signup_id: signUpId,
    }
    const result = helpers.parseSignUpToVolunteer(input, signUpId)
    expect(result).toEqual(expected)
  })
})

describe('parseVolunteerToGeoJson', () => {
  const input = {
    group_links: {
      telegram: '',
      discord: '',
      facebook: 'https://www.facebook.com/groups/215636692879586/',
    },
    services_offered: 'Shopping, Chat',
    email: '',
    name: 'Lynne Nathan',
    owns_car: true,
    spoken_languages: '',
    availability: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    postcode: 'NW11 8AU',
  }
  const expected = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-0.20109, 51.57622] },
    properties: {
      Display: 'Lynne',
      'Do you have a car?': 'Yes',
      'Services offered': 'Shopping, Chat',
      WhatsApp: '',
      Facebook: 'https://www.facebook.com/groups/215636692879586/',
      Availability:
        'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday',
      'Spoken languages': '',
      volunteerid: '81',
    },
  }
  const expectedKeys = Object.keys(expected)
    expectedKeys.forEach(key => {
      it(`result has correct ${key} value`, async () => {
        const result = await helpers.convertVolunteerToGeoJson(input)
        const resultValue = result[key]
        const expectedValue = expected[key]
        expect(resultValue).toEqual(expectedValue)
      })
    })
})
