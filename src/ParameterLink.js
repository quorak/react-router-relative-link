import React from 'react'
import PropTypes from 'prop-types'
import resolvePathname from 'resolve-pathname'

const ParameterLink = ({ BaseComponent, match, params, staticContext, ...others }) => {
  let newParams = Object.assign({}, match.params, params)
  const to = Object.keys(newParams).reduce((replacedPath, param) => replacedPath.replace(':' + param, newParams[param]), match.path).replace(/\(.*\)|\?/g, '')

  return <BaseComponent to={to} {...others} />
}

ParameterLink.propTypes = {
  BaseComponent: PropTypes.func.isRequired,
  staticContext: PropTypes.object,
  match: PropTypes.shape({
    url: PropTypes.string
  }).isRequired,
  params: PropTypes.object.isRequired
}

export default ParameterLink
