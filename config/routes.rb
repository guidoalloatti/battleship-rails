Rails.application.routes.draw do
  resource  :session
  resources :examples

  resources :messages do
    resources :comments
  end

  get '/player/1', to: 'game#index'
  get '/player/2', to: 'game#index'
  get '/game/1', to: 'game#player_1'
  get '/game/2', to: 'game#player_2'

  root 'examples#index'
  
  mount ActionCable.server => '/cable'

end
