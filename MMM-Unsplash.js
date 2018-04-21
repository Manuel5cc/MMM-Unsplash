Module.register('MMM-Unsplash', {
  defaults: {
    opacity: 0.3,
    collections: '',
    width: 1080,
    height: 1920,
    orientation: 'portrait',
    apiKey: '',
    updateInterval: 1800,
  },

  start: function() {
    this.load()
  },

  load: function() {
    var self = this

    var req = new XMLHttpRequest()
    var params = {
      collections: self.config.collections,
      w: self.config.width,
      h: self.config.height,
      orientation: self.config.orientation,
    }

    req.addEventListener('load', function() {
      if (this.status == 200) {
        var obj = JSON.parse(this.responseText)
        var img1 = document.getElementById('mmm-unsplash-placeholder1')
        var img2 = document.getElementById('mmm-unsplash-placeholder2')

        img1.addEventListener('load', function() {
          fade(img1, self.config.opacity, function() {
            img1.id = 'mmm-unsplash-placeholder2'
          })

          fade(img2, 0, function() {
            img2.id = 'mmm-unsplash-placeholder1'
          })
        })

        img1.src = obj.urls.custom
      }
    })

    req.open('GET', 'https://api.unsplash.com/photos/random' + formatParams(params))
    req.setRequestHeader('Accept-Version', 'v1')
    req.setRequestHeader('Authorization', 'Client-ID ' + this.config.apiKey)
    req.send()

    setTimeout(function() {
      self.load();
    }, (self.config.updateInterval * 1000));
  },

  getDom: function() {
    var wrapper = document.createElement('div')
    wrapper.innerHTML = '<img id="mmm-unsplash-placeholder1" style="opacity: 0; position: absolute; top: 0" /><img id="mmm-unsplash-placeholder2" style="opacity: 0; position: absolute; top: 0" />'
    return wrapper
  }
})

function formatParams( params ){
  return "?" + Object
        .keys(params)
        .map(function(key){
          return key+"="+encodeURIComponent(params[key])
        })
        .join("&")
}

function fade(elem, target, done) {
  var opacity = parseFloat(elem.style.opacity)
  var out = opacity > target
  if (opacity > target) {
    opacity -= 0.05
  } else if (opacity < target) {
    opacity += 0.05
  }

  elem.style.opacity = opacity

  if ((!out && opacity < target) || (out && opacity > target)) {
    setTimeout(function() { fade(elem, target, done) }, 60)
  } else {
    elem.style.opacity = target
    done()
  }
}
