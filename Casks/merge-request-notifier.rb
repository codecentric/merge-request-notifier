cask 'merge-request-notifier' do
  version '0.6.0'
  sha256 :no_check

  url 'https://github.com/codecentric/merge-request-notifier/releases/download/v#{version}/Merge.Request.Notifier-#{version}.dmg'
  appcast 'https://github.com/codecentric/merge-request-notifier/releases.atom'
  name 'Merge Request Notifier'
  homepage 'https://github.com/codecentric/merge-request-notifier'
end
