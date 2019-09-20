cask 'merge-request-notifier' do
  version :latest
  sha256 :no_check

  url 'https://github.com/codecentric/merge-request-notifier/releases/download/v#{version}/Merge.Request.Notifier-#{version}.dmg'
  appcast 'https://github.com/codecentric/merge-request-notifier/releases.atom'
  name 'Merge Request Notifier'
  homepage 'https://github.com/codecentric/merge-request-notifier'
end
