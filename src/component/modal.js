import { Modal } from 'antd-mobile'
import { ModalComponent } from 'antd-mobile/lib/modal/Modal'
import { reaction } from 'mobx'
import { routerStore } from '@store'

function transform(name) {
  return function () {
    const instance = Modal[name].apply(Modal, arguments)
    const disposer = reaction(
      () => routerStore.location,
      () => {
        instance.close()
        disposer()
      }
    )
    return {
      close() {
        disposer()
        instance.close()
      }
    }
  }
}

export const alert: ModalComponent.alert = transform('alert')
export const prompt: ModalComponent.prompt = transform('prompt')
export const operation: ModalComponent.operation = transform('operation')

export default { alert, prompt, operation }
