function parseSignUpToVolunteer(input, signUpId) {
  const result = {
    availability: input.availability,
    discord: input.discord,
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
  return result
}

module.exports = {
  parseSignUpToVolunteer
}