import { Injectable, Renderer2, RendererFactory2 } from '@angular/core'

export interface CustomScript {
  name   : string,
  tag    : string
  attrs  : { name: string, value: string }[],
  loaded?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class LoadScriptService {
  private render: Renderer2

  private scripts: any[]

  constructor(rendererFactory: RendererFactory2 ) { 
    this.render = rendererFactory.createRenderer(null, null)
    this.scripts = []
  }

  load(script: CustomScript): Promise<{ script: string, loaded: boolean, status: string }> {
    return new Promise(resolve => {
      if (!this.scripts[script.name]) {
        this.scripts[script.name] = script
      }

      if (this.scripts[script.name].loaded) { 
        resolve({ script: script.name, loaded: true, status: 'Already Loaded' })
        return
      }

      const elem = this.render.createElement(script.tag)
  
      script.attrs.forEach( attr => {
        this.render.setAttribute(elem, attr.name, attr.value)
      })

      if (elem.readyState) {  // IE
        elem.onreadystatechange = () => {
          if (elem.readyState === 'loaded' || elem.readyState === 'complete') {
            elem.onreadystatechange          = null
            this.scripts[script.name].loaded = true
            resolve({ script: script.name, loaded: true, status: 'Loaded' })
          }
        }
      } else {
        elem.onload = () => {
          this.scripts[script.name].loaded = true
          resolve({ script: script.name, loaded: true, status: 'Loaded' })
        }
      }
      elem.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Error on load' })

      const doc = this.render.selectRootElement('head', true)
      this.render.appendChild(doc, elem)
    })
  }
}
