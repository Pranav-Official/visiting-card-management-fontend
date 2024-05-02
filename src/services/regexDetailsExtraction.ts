const regexDetailsExtraction = (text: string) => {
  var emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  var websiteRegex =
    /\b(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  var extractedEmails = text.match(emailRegex);
  var extractedWebsites = text.match(websiteRegex);
  var extractedPhones = text.match(phoneRegex);
  return {
    status: true,
    data: {
      fullname: null,
      'job-title': null,
      phone: extractedPhones?.[0] ?? null,
      email: extractedEmails?.[0] ?? null,
      website: extractedWebsites?.[0] ?? null,
      company: null,
    },
  };
};

export default regexDetailsExtraction;
