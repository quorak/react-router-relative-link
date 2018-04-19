import React from 'react'
import PropTypes from 'prop-types'
import resolvePathname from 'resolve-pathname'

const ensureLeadingAndTrailingSlashes = path => path.replace(/^\/?/, '/').replace(/\/?$/, '/')
const removeTrailingSlash = path => path.replace(/\/$/, '') || '/'
const removeQuery = path => path.split('?')[0]
const resolvePathnameNoTrailingSlash = (path, currentPath) => removeTrailingSlash(resolvePathname(`${path}`, currentPath))
const resolvePathnameFromMatchPathAndParams = (match, newParams) => {
  let combinedParams = Object.assign({}, match.params, newParams)
  return Object.keys(combinedParams)
                      .reduce((replacedPath, param) => replacedPath.replace(':' + param, combinedParams[param]), match.path)
                      .replace(/\(.*\)|\?/g, '')
}

const extractCurrentPath = currentPath => (
  ensureLeadingAndTrailingSlashes(removeQuery(currentPath))
)

const CoreLink = ({ BaseComponent, match, to: relativeTo, staticContext, ...others }) => {
  const currentPath = extractCurrentPath(match.url)
  const to = typeof relativeTo === 'object'
    ? {
      ...relativeTo,
      pathname: relativeTo.params
        ? substituteMatch(match, relativeTo.params)
        : resolvePathnameNoTrailingSlash(relativeTo.pathname, currentPath)
    }
    : resolvePathnameNoTrailingSlash(relativeTo, currentPath)

  return <BaseComponent to={to} {...others} />
}

CoreLink.propTypes = {
  BaseComponent: PropTypes.func.isRequired,
  staticContext: PropTypes.object,
  match: PropTypes.shape({
    url: PropTypes.string
  }).isRequired,
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      pathname: PropTypes.string,
      search: PropTypes.string,
      hash: PropTypes.string
    })
  ]).isRequired
}

export {CoreLink as default, resolvePathnameFromMatchPathAndParams as substituteMatch}
