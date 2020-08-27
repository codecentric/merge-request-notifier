cask 'merge-request-notifier' do
  version '1.8.3'
  sha256 '2d1e2cac96f81564330486840f1136aaf668180c4683ea4a9b2115e275f546af'

  url "https://github.com/codecentric/merge-request-notifier/releases/download/v#{version}/Merge-Request-Notifier-#{version}.dmg"
  appcast 'https://github.com/codecentric/merge-request-notifier/releases.atom'
  name 'Merge Request Notifier'
  homepage 'https://github.com/codecentric/merge-request-notifier'

  app 'Merge Request Notifier.app'
end
