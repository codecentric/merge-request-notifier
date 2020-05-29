cask 'merge-request-notifier' do
  version '1.7.0'
  sha256 'eaed2900ab85ef6583aadc6cbc95559db51a7c68f70a52b1dea0d31679f0ac63'

  url "https://github.com/codecentric/merge-request-notifier/releases/download/v#{version}/Merge-Request-Notifier-#{version}.dmg"
  appcast 'https://github.com/codecentric/merge-request-notifier/releases.atom'
  name 'Merge Request Notifier'
  homepage 'https://github.com/codecentric/merge-request-notifier'

  app 'Merge Request Notifier.app'
end
