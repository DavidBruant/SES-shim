import { makeModuleInstance } from './moduleInstance';

const { keys } = Object;

const makeMap = (...args) => new Map(...args);

export const makeEvaluateLinker = (evaluator, instanceCache = new Map()) => {
  const tolerantEvaluator = (src, endowments, options = {}) => {
    // Our sources have been already rewritten, so allow the hidden identifiers.
    const tolerantOptions = { ...options, allowHidden: true };
    return evaluator(src, endowments, tolerantOptions);
  };
  const linker = {
    // Instantiation phase produces a linked module instance. A module
    // instance is linked when its importNS is populated with linked
    // module instances whose exports satify this module's imports.
    link(linkageRecord, recursiveLink, preEndowments) {
      const linkedImportNS = makeMap();
      const linkedInstance = makeModuleInstance(
        linkageRecord,
        linkedImportNS,
        tolerantEvaluator,
        preEndowments,
      );
      instanceCache.set(linkageRecord.moduleLocation, linkedInstance);

      for (const specifier of keys(linkageRecord.imports)) {
        const moduleLocation = linkageRecord.moduleLocations.get(specifier);
        const importedInstance = recursiveLink(
          moduleLocation,
          linker,
          preEndowments,
        );
        linkedImportNS.set(moduleLocation, importedInstance);
      }

      return linkedInstance;
    },
    instanceCache,
  };
  return linker;
};
