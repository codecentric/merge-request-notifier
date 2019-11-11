cask 'merge-request-notifier' do
  version '0.9.0'
  sha256 'e39281c8a2aaa862c6c66af198ff8fb9743dd5fcc24d594e81ee558b41944a34'

  url "https://github.com/codecentric/merge-request-notifier/releases/download/v#{version}/Merge.Request.Notifier-#{version}.dmg"
  appcast 'https://github.com/codecentric/merge-request-notifier/releases.atom'
  name 'Merge Request Notifier'
  homepage 'https://github.com/codecentric/merge-request-notifier'

  app 'Merge Request Notifier.app'
end
