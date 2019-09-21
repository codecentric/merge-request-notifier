cask 'merge-request-notifier' do
  version '0.6.0'
  sha256 'c58b38a84f7f0c5570636a0ac3127b634bb055945fe5e02c9e7437993d5fa571'

  url "https://github.com/codecentric/merge-request-notifier/releases/download/v#{version}/Merge.Request.Notifier-#{version}.dmg"
  appcast 'https://github.com/codecentric/merge-request-notifier/releases.atom'
  name 'Merge Request Notifier'
  homepage 'https://github.com/codecentric/merge-request-notifier'

  app 'Merge Request Notifier.app'
end
