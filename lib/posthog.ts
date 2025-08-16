import PostHog from 'posthog-react-native'

export const posthog = new PostHog('phc_xH2kfTiKCLZUU3JMgZyhwuD1pzU6kEBIloIrnSre1Y4', {
  // usually 'https://us.i.posthog.com' or 'https://eu.i.posthog.com'  
  host: 'https://us.i.posthog.com' // host is optional if you use https://us.i.posthog.com
})