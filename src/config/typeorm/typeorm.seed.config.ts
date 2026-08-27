import typeormConfigs from './typeorm.config';
import { paths } from './typeorm.migration.config';

const options = typeormConfigs();
options['seeds'] = paths.seeds;
options['factories'] = paths.factories;
options['entities'] = paths.entities;
export default options;
