cask 'merge-request-notifier' do
  version '1.8.4'
  sha256 '227e7bb5d6ff02816ad65d3a475a7c4916e28f29ceabed237268aa79b141e889'

  url "https://github.com/codecentric/merge-request-notifier/releases/download/v#{version}/Merge-Request-Notifier-#{version}.dmg"
  appcast 'https://github.com/codecentric/merge-request-notifier/releases.atom'
  name 'Merge Request Notifier'
  homepage 'https://github.com/codecentric/merge-request-notifier'

  app 'Merge Request Notifier.app'
end
