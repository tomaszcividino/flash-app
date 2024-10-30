import tslint from 'typescript-eslint'

export default {
  ...tslint.configs.strict,
  ...tslint.configs.stylistic
}
