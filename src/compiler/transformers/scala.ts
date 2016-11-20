/// <reference path="../factory.ts" />
/// <reference path="../visitor.ts" />

/*@internal*/
namespace ts {
    //const brackets = createBracketsMap();

    const keywords = {
        "type": 0,
        "match": 0,
        "object": 0
    };

    export function transformScala(context: TransformationContext) {
        return transformSourceFile;

        function transformSourceFile(node: SourceFile) {
            emitScala(node);
            return node;
        }

        function emitScala(node: SourceFile) {
            const targetFileName = node.fileName + ".scala";
            const emitterDiagnostics = createDiagnosticCollection();
            const host = context.getEmitHost();
            //const resolver = context.getEmitResolver();
            const writer = createTextWriter(host.getNewLine());

            emitNode(writer, node);
            
            // Write the output file
            writeFile(host, emitterDiagnostics, targetFileName, writer.getText(), false);
        }

        function emitNode(writer: EmitTextWriter, node: Node): void {
            const {
                write,
                writeLine
            } = writer;

            let counter = 0;
          
            emit(node);
  
            function fresh() {
               counter += 1;
               return "fresh" + counter;
            }

            function emitTokenText(kind: SyntaxKind): void {
                switch (kind) {
                    case SyntaxKind.AnyKeyword:
                        write("Any");
                        break;
                    case SyntaxKind.BooleanKeyword:
                        write("Boolean");
                        break;
                    case SyntaxKind.NumberKeyword:
                        // In theory, Double, but we expect and hope most numbers are actually Ints
                        write("Int");
                        break;
                    case SyntaxKind.StringKeyword:
                        write("String");
                        break;
                    case SyntaxKind.VoidKeyword:
                        write("Unit");
                        break;
                    case SyntaxKind.NeverKeyword:
                        write("Nothing");
                        break;
                    default:
                        write(tokenToString(kind));
                        break;
                }
            }

            function emitSourceFile(node: SourceFile): void {
                console.log("Processing source file: " + node.fileName);

                const statements = node.statements;
                const statementOffset = emitPrologueDirectives(statements);
                ///const savedTempFlags = tempFlags;
                //tempFlags = 0;
                //emitHelpers(node);
                for (let i = statementOffset; i < statements.length; ++i) {
                    emit(statements[i]);
                    writeLine();
                }

                //emitList(node, statements, ListFormat.MultiLine, statementOffset);
                //tempFlags = savedTempFlags;
            }

            /**
             * Emits any prologue directives at the start of a Statement list, returning the
             * number of prologue directives written to the output.
             */
            function emitPrologueDirectives(statements: Node[]): number {
                for (let i = 0; i < statements.length; i++) {
                    if (isPrologueDirective(statements[i])) {
                        /*if (startWithNewLine || i > 0) {
                            writeLine();
                        }
                        emit(statements[i]);*/
                    }
                    else {
                        // return index of the first non prologue directive
                        return i;
                    }
                }

                return statements.length;
            }

            function emitParameter(node: ParameterDeclaration): void {
                emitDecorators(node.decorators);
                emitModifiers(node.modifiers);
                emit(node.name);
                emitExpressionWithPrefix(" = ", node.initializer);
                emitWithPrefix(": ", node.type);
            }



            function emitIdentifier(node: Identifier): void {
                const text = node.text
                if (text in keywords) {
                  write("`" + text + "`");
                } else if (text === "_") {
                  write("_underscore_");
                } else {
                  write(text);
                }
            }

            function emitQualifiedName(node: QualifiedName): void {
                emit(node.left);
                write(".");
                emit(node.right);
            }

            function emitComputedPropertyName(node: ComputedPropertyName): void {
                emit(node.expression);
            }

            function emitTypeParameters(tparams: NodeArray<TypeParameterDeclaration>): void {
                if (tparams && tparams.length !== 0) {
                    write("[");
                    let first = true;
                    for (const param of tparams) {
                        if (first)
                            first = false;
                        else
                            write(", ");
                        emitTypeParameter(param);
                    }
                    write("]");
                }
            }

            function emitTypeParameter(node: TypeParameterDeclaration): void {
                emit(node.name);
                if (node.constraint) {
                    write(" <: ");
                    emit(node.constraint);
                }
            }
            
            function emitDecorator(node: Decorator): void {
                console.log("emitDecorator");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitPropertySignature(node: PropertySignature): void {
                write("  var ");
                emit(node.name);
                emitTypeResult(node.type, /*canInfer*/ !!node.initializer);
                if (node.initializer) {
                    write(" = ");
                    emit(node.initializer);
                }
                writeLine();
            }
            
            function emitPropertyDeclaration(node: PropertyDeclaration): void {
                write("  var ");
                emit(node.name);
                emitTypeResult(node.type, /*canInfer*/ !!node.initializer);
                write(" = ");
                if (node.initializer)
                    emit(node.initializer);
                else
                    write("_");
                writeLine();
            }
            
            function emitMethodSignature(node: MethodSignature): void {
                write("  def ");
                emit(node.name);
                emitSignature(node);
                emitTypeResult(node.type, /*canInfer*/ false);
                writeLine();
            }
            
            function emitMethodDeclaration(node: MethodDeclaration): void {
                write("  def ");
                emit(node.name);
                emitSignature(node);
                emitTypeResult(node.type, /*canInfer*/ !!node.body);
                if (node.body) {
                    write(" = ");
                    emit(node.body);
                }
                writeLine();
            }
            
            function emitConstructor(node: ConstructorDeclaration): void {
                write("  def this");
                emitSignature(node);
                if (node.body) {
                    write(" = ");
                    emit(node.body);
                } else {
                    // make it parse in Scala, somehow
                    write(" = this()");
                }
                writeLine();
            }
            
            function emitAccessorDeclaration(node: AccessorDeclaration): void {
                console.log("emitAccessorDeclaration");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitCallSignature(node: CallSignatureDeclaration): void {
                write("  def apply");
                emitSignature(node);
                emitTypeResult(node.type, /*canInfer*/ false);
                writeLine();
            }
            
            function emitConstructSignature(node: ConstructSignatureDeclaration): void {
                write("  def `new`");
                emitSignature(node);
                emitTypeResult(node.type, /*canInfer*/ false);
                writeLine();
            }
            
            function emitIndexSignature(node: IndexSignatureDeclaration): void {
                write("  def apply");
                emitSignature(node);
                emitTypeResult(node.type, /*canInfer*/ false);
                writeLine();
                write("  /* def update() -- if you need it */");
                writeLine();
            }
            
            function emitTypePredicate(node: TypePredicateNode): void {
                const {} = node;
                write("Boolean");
            }

            function emitTypeReference(node: TypeReferenceNode): void {
                emit(node.typeName);
                if (node.typeArguments && node.typeArguments.length !== 0) {
                    let first = true;
                    write("[");
                    for (const typeArg of node.typeArguments) {
                        if (first)
                            first = false;
                        else
                            write(", ");
                        emit(typeArg);
                    }
                    write("]");
                }
            }
            
            function emitFunctionOrConstructorTypeNode(node: FunctionOrConstructorTypeNode): void {
                write("((");
                if (node.parameters) {
                    let first = true;
                    for (const param of node.parameters) {
                        if (first)
                            first = false;
                        else
                            write(", ");
                        emit(param.type);
                    }
                }
                write(") => ");
                emit(node.type);
                write(")");
            }

            function emitFunctionType(node: FunctionTypeNode): void {
                emitFunctionOrConstructorTypeNode(node);
            }

            function emitConstructorType(node: ConstructorTypeNode): void {
                emitFunctionOrConstructorTypeNode(node);
            }
            
            function emitTypeQuery(node: TypeQueryNode): void {
                emit(node.exprName);
                write(".type");
            }
            
            function emitTypeLiteral(node: TypeLiteralNode): void {
                write("{");
                emitList(node.members, ListFormat.TypeLiteralMembers);
                write("}");
            }
            
            function emitArrayType(node: ArrayTypeNode): void {
                write("Array[");
                emit(node.elementType);
                write("]");
            }
            
            function emitTupleType(node: TupleTypeNode): void {
                write("(");
                let first = true;
                for (const item of node.elementTypes) {
                    if (first)
                        first = false;
                    else
                        write(", ");
                    emit(item);
                }
                write(")");
            }
            
            function emitUnionType(node: UnionTypeNode): void {
                write("(");
                emitList(node.types, ListFormat.UnionTypeConstituents);
                write(")");
            }
            
            function emitIntersectionType(node: IntersectionTypeNode): void {
                write("(");
                emitList(node.types, ListFormat.IntersectionTypeConstituents);
                write(")");
            }
            
            function emitParenthesizedType(node: ParenthesizedTypeNode): void {
                emit(node.type);
            }
            
            function emitExpressionWithTypeArguments(node: ExpressionWithTypeArguments): void {
                emit(node.expression);
                emitTypeArguments(node.typeArguments);
            }
            
            function emitThisType(): void {
                console.log("emitThisType");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitLiteralType(node: LiteralTypeNode): void {
                write("`");
                emit(node.literal);
                write("`");
            }
            
            function emitObjectBindingPattern(node: ObjectBindingPattern): void {
                console.log("unreachable: emitObjectBindingPattern in " + node.parent.kind);
            }
            
            function emitArrayBindingPattern(): void {
                console.log("unreachable: emitArrayBindingPattern");
            }
            
            function emitBindingElement(): void {
                console.log("unreachable: emitBindingElement");
            }
            
            function emitTemplateSpan(node: TemplateSpan): void {
                emitExpression(node.expression);
                emit(node.literal);
            }
            
            function emitSemicolonClassElement(): void {
                console.log("emitSemicolonClassElement");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitBlock(node: Block): void {   
                if (isSingleLineEmptyBlock(node)) {
                    emitTokenText(SyntaxKind.OpenBraceToken);
                    write(" ");
                    emitTokenText(SyntaxKind.CloseBraceToken);
                }
                else {
                    emitTokenText(SyntaxKind.OpenBraceToken);
                    writeLine();
                    emitBlockStatements(node);
                    writeLine();
                    emitTokenText(SyntaxKind.CloseBraceToken);
                }
            }

            function emitBlockStatements(node: BlockLike) {
                if (getEmitFlags(node) & EmitFlags.SingleLine) {
                    emitList(node.statements, ListFormat.SingleLineBlockStatements);
                }
                else {
                    emitList(node.statements, ListFormat.MultiLineBlockStatements);
                }
            }

            function emitVariableStatement(node: VariableStatement): void {
                emitModifiers(node.modifiers);
                emit(node.declarationList);        
            }

            function emitModifiers(modifiers: NodeArray<Modifier>) {
                let { } = modifiers; 
                // if (modifiers && modifiers.length) {
                //     emitList(modifiers, ListFormat.Modifiers);
                //     write(" ");
                // }
            }
            
            function emitEmptyStatement(): void {
                write(";");
            }
            
            function emitExpressionStatement(node: ExpressionStatement): void {
                emitExpression(node.expression);
                writeLine();
            }

            function emitIfStatement(node: IfStatement): void {
                emitTokenText(SyntaxKind.IfKeyword);
                write(" ");
                emitTokenText(SyntaxKind.OpenParenToken);
                emitExpression(node.expression);
                emitTokenText(SyntaxKind.CloseParenToken);
                emitEmbeddedStatement(node.thenStatement);
                if (node.elseStatement) {
                    writeLine();
                    emitTokenText(SyntaxKind.ElseKeyword);
                    if (node.elseStatement.kind === SyntaxKind.IfStatement) {
                        write(" ");
                        emit(node.elseStatement);
                    }
                    else {
                        emitEmbeddedStatement(node.elseStatement);
                    }
                }
           }

           function emitEmbeddedStatement(node: Statement) {
                if (isBlock(node)) {
                    write(" ");
                    emit(node);
                }
                else {
                    writeLine();
                    emit(node);
                }
            }
            
            function emitDoStatement(node: DoStatement): void {
                write("do {");
                writeLine();
                emit(node.statement);
                writeLine();
                write("} while (");
                emit(node.expression);
                write(")");
            }
            
            function emitWhileStatement(node: WhileStatement): void {
                write("while (");
                emit(node.expression);
                write(") {");
                writeLine();
                emit(node.statement);
                writeLine();
                write("}");
            }
            
            function emitForStatement(node: ForStatement): void {
                write("{");
                writeLine();
                emitForBinding(node.initializer);
                writeLine();
                write("while(")
                emitExpressionWithPrefix(" ", node.condition);
                write(") {")
                writeLine();
                emitEmbeddedStatement(node.statement);
                writeLine();
                emitExpressionWithPrefix(" ", node.incrementor);
                writeLine();
                write("}")
                writeLine();
                write("}")
            }

            function emitForBinding(node: VariableDeclarationList | Expression) {
                if (node !== undefined) {
                    if (node.kind === SyntaxKind.VariableDeclarationList) {
                        emit(node);
                    }
                    else {
                        emitExpression(<Expression>node);
                    }
                }
            }
            
            function emitForInStatement(node: ForInStatement): void {
                write("(");
                emitExpression(node.expression);
                const x = fresh();
                write(").keys.foreach { " + x + " => ");      
                writeLine();      
                emitForBinding(node.initializer);
                write(" = " + x)
                writeLine();
                emitEmbeddedStatement(node.statement);
                writeLine();
                write("}");
            }
            
            function emitForOfStatement(node: ForOfStatement): void {
                write("(");
                emitExpression(node.expression);
                const x = fresh();
                write(").foreach { " + x + " => ");      
                writeLine();      
                emitForBinding(node.initializer);
                write(" = " + x)
                writeLine();
                emitEmbeddedStatement(node.statement);
                writeLine();
                write("}");
            }
            
            function emitContinueStatement(node: ContinueStatement): void {
                if (node.label) {
                    write("continue ");
                    emit(node.label);
                } else {
                    write("continue");
                }
            }
            
            function emitBreakStatement(node: BreakStatement): void {
                if (node.label) {
                    emit(node.label);
                    write(".break()");
                } else {
                    write("break()");
                }
            }
            
            function emitReturnStatement(node: ReturnStatement): void {
                emitTokenText(SyntaxKind.ReturnKeyword);
                emitExpressionWithPrefix(" ", node.expression);
                writeLine();
            }
            
            function emitWithStatement(node: WithStatement): void {
                console.log("emitWhileStatement");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitSwitchStatement(node: SwitchStatement): void {
                emit(node.expression);
                write(" match {");
                writeLine();
                const clauses = node.caseBlock.clauses;
                let alternatives = createNodeArray<Expression>();
                let hasDefault = false;
                for (const clause of clauses) {
                    switch (clause.kind) {
                        case SyntaxKind.CaseClause:
                            const caseClause = <CaseClause>clause;
                            alternatives.push(caseClause.expression);
                            const statements = caseClause.statements;
                            if (statements.length) {
                                write("  case ");
                                emitList(alternatives, ListFormat.UnionTypeConstituents);
                                write(" =>");
                                writeLine();
                                alternatives = createNodeArray<Expression>();
                                const canFallThrough = emitSwitchClauseStatements(statements);
                                if (canFallThrough)
                                    console.log("WARNING: non-empty case can fall through");
                            }
                            break;

                        case SyntaxKind.DefaultClause:
                            const defaultClause = <DefaultClause>clause;
                            hasDefault = true;
                            if (alternatives.length)
                                console.log("INFO: discarding alternatives in default");
                            write("  case _ =>");
                            writeLine();
                            emitSwitchClauseStatements(defaultClause.statements);
                            break;
                    }
                }
                if (!hasDefault) {
                    write("  case _ =>");
                    writeLine();
                }
                write("}");
                writeLine();
            }

            // returns true if the clause can fall through
            function emitSwitchClauseStatements(statements: NodeArray<Statement>): boolean {
                for (const statement of statements) {
                    switch (statement.kind) {
                        case SyntaxKind.BreakStatement:
                            return false;
                        case SyntaxKind.ContinueStatement:
                        case SyntaxKind.ReturnStatement:
                            emit(statement);
                            writeLine();
                            return false;
                        default:
                            emit(statement);
                            writeLine();
                            break;
                    }
                }
            }
            
            function emitLabeledStatement(node: LabeledStatement): void {
                write("val ");
                emit(node.label);
                write(" = new scala.util.control.Breaks");
                writeLine();
                emit(node.label);
                write(".breakable {");
                writeLine();
                emit(node.statement);
                writeLine();
                write("}");
            }
            
            function emitThrowStatement(node: ThrowStatement): void {
                write("throw");
                emitExpressionWithPrefix(" ", node.expression);
            }
            
            function emitTryStatement(node: TryStatement): void {
                write("try ");            
                emit(node.tryBlock);
                if (node.catchClause) {
                    emit(node.catchClause);
                }
                if (node.finallyBlock) {
                    write(" finally ");
                    emit(node.finallyBlock);
                }
            }
            
            function emitDebuggerStatement(): void {
                write(";");
            }
            
            function emitVariableDeclaration(node: VariableDeclaration): void {
                emit(node.name);
                emitWithPrefix(": ", node.type);
                emitExpressionWithPrefix(" = ", node.initializer);
            }
            
            function emitVariableDeclarationList(decls: VariableDeclarationList): void {
                const varity = isLet(node) ? "var " : isConst(decls) ? "val " : "var "
                let emitRhs: () => void;
                for (const decl of decls.declarations) {
                    emitRhs = () => {
                        if (decl.initializer) 
                            emitExpressionWithPrefix(" = ", decl.initializer);
                        else
                            write(" = zeroOfMyType");                       
                    }
                    function ident(ident: Identifier): void {
                        emitModifiers(node.modifiers);
                        write(varity);
                        emitIdentifier(ident);
                        emitWithPrefix(": ", decl.type);
                        emitRhs();
                        writeLine();
                    }
                    const name = decl.name;
                    switch (name.kind) {
                        case SyntaxKind.Identifier:                            
                            ident(<Identifier> name);
                            break;
                        case SyntaxKind.ObjectBindingPattern:
                            const objpat = <ObjectBindingPattern> name;
                            if (objpat.elements) {
                                const x = fresh()
                                write("const " + x);
                                emitRhs();
                                writeLine();

                                for (const elem of objpat.elements) {                                    
                                    switch (elem.name.kind) {
                                        case SyntaxKind.Identifier:
                                            const nested = <Identifier> elem.name;
                                            emitRhs = () => {
                                                write(" = ");
                                                write(x + ".");
                                                emitIdentifier(nested);
                                                writeLine();
                                            };
                                            ident(nested);
                                            break;
                                        default:
                                            console.log("Warning: nested object patterns are not supported")
                                            break;
                                    }
                                }
                            }
                            break;
                        case SyntaxKind.ArrayBindingPattern:
                            console.log("Warning: array patterns are not supported");
                            break;
                    }
                }
            }
            
            function emitFunctionDeclaration(node: FunctionDeclaration): void {
                write("def ");
                emit(node.name);
                emitSignature(node);
                emitTypeResult(node.type, /*canInfer*/ !!node.body);
                if (node.body) {
                    write(" = ");
                    emit(node.body);
                }
                writeLine();
            }

            function emitSignature(node: SignatureDeclaration): void {
                emitTypeParameters(node.typeParameters);
                emitParameterList(node.parameters);
            }

            function emitParameterList(parameters: NodeArray<ParameterDeclaration>): void {
                write("(");
                let first = true;
                for (const param of parameters) {
                    if (first)
                        first = false;
                    else
                        write(", ");
                    emit(param.name);
                    emitTypeResult(param.type, /*canInfer*/ false);
                    if (param.initializer) {
                        write(" = ");
                        emit(param.initializer);
                    }
                }
                write(")");
            }

            function emitTypeResult(type: TypeNode, canInfer: boolean): void {
                if (type || !canInfer) {
                    write(": ");
                    if (type)
                        emit(type);
                    else
                        write("Nothing");
                }
            }

            function emitClassDeclaration(node: ClassDeclaration): void {
                write("class ");
                emit(node.name);
                emitTypeParameters(node.typeParameters);
                emitHeritageClauses(node.heritageClauses);
                write(" {");
                writeLine();
                for (const member of node.members) {
                    emit(member);
                    writeLine();
                }
                write("}");
                writeLine();
            }

            function emitInterfaceDeclaration(node: InterfaceDeclaration): void {
                write("trait ");
                emit(node.name);
                emitTypeParameters(node.typeParameters);
                emitHeritageClauses(node.heritageClauses);
                write(" {");
                writeLine();
                for (const member of node.members) {
                    emit(member);
                    writeLine();
                }
                write("}");
                writeLine();
            }

            function emitTypeAliasDeclaration(node: TypeAliasDeclaration): void {
                write("type ");
                emit(node.name);
                emitTypeParameters(node.typeParameters);
                write(" = ");
                emit(node.type);
                writeLine();
            }
            
            function emitEnumDeclaration(node: EnumDeclaration): void {
                write("sealed abstract class ");
                emit(node.name);
                writeLine();
                write("object ");
                emit(node.name);
                write(" {");
                writeLine();
                emitList(node.members, ListFormat.EnumMembers);
                writeLine();
                write("}");
                writeLine();
            }
            
            function emitModuleDeclaration(node: ModuleDeclaration): void {
                write("object ");
                //console.log(node.name);
                emit(node.name);
                write(" {");
                writeLine();
                //console.log(node.body);
                emit(node.body);
                write("}");
                writeLine();
            }

            function emitModuleBlock(node: ModuleBlock): void {
                for (const stat of node.statements)
                    emit(stat);
            }

            function emitImportEqualsDeclaration(node: ImportEqualsDeclaration): void {
                console.log("emitImportEqualsDeclaration");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitImportDeclaration(node: ImportDeclaration): void {
                console.log("emitImportDeclaration");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitImportClause(node: ImportClause): void {
                console.log("emitImportClause");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitNamespaceImport(node: NamespaceImport): void {
                console.log("emitNamespaceImport");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitNamedImports(node: NamedImports): void {
                console.log("emitNamedImports");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitImportSpecifier(node: ImportSpecifier): void {
                console.log("emitImportSpecifier");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitExportAssignment(node: ExportAssignment): void {
                console.log("emitExportAssignment");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitExportDeclaration(node: ExportDeclaration): void {
                console.log("emitExportDeclaration");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitNamedExports(node: NamedExports): void {
                console.log("emitNamedExports");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitExportSpecifier(node: ExportSpecifier): void {
                console.log("emitExportSpecifier");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitHeritageClauses(nodes: NodeArray<HeritageClause>): void {
                if (nodes) {
                    //let first = true;
                    for (const node of nodes) {
                        /*if (first) {
                            write(" extends ");
                            first = false;
                        } else {
                            write(" with ");
                        }*/
                        emitHeritageClause(node);
                    }
                }
            }
            
            function emitHeritageClause(node: HeritageClause): void {
                if (node.types) {
                    let first = true;
                    for (const type of node.types) {
                        if (first) {
                            write(" extends ");
                            first = false;
                        } else {
                            write(" with ");
                        }
                        emit(type);
                    }
                }
            }
            
            function emitCatchClause(node: CatchClause): void {
                write(" catch { case ");
                emit(node.variableDeclaration);
                write(": Throwable => ")        
                emit(node.block);
                write("}");
            }
            
            function emitPropertyAssignment(node: PropertyAssignment): void {
                if (node.initializer) {
                    if (node.name.kind === SyntaxKind.Identifier)
                        write('"' + (<Identifier>node.name).text + '"');
                    else
                        emit(node.name);
                    write(" -> ");
                    emit(node.initializer);
                }
            }
            
            function emitShorthandPropertyAssignment(node: ShorthandPropertyAssignment): void {
                write('"' + node.name.text + '" -> ');
                emit(node.name);
            }
            
            function emitEnumMember(node: EnumMember): void {
                write("  case object ");
                emit(node.name);
                write(" extends ");
                emit((<EnumDeclaration>node.parent).name);
            }
            
            function emitExternalModuleReference(node: ExternalModuleReference): void {
                console.log("emitExternalModuleReference");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitArrayLiteralExpression(node: ArrayLiteralExpression): void {
                const elements = node.elements;
                if (elements.length === 0) {
                    write("Array()");
                }
                else {
                    write("Array");
                    emitExpressionList(elements, ListFormat.ArrayLiteralExpressionElements);
                }
            }
            
            function emitObjectLiteralExpression(node: ObjectLiteralExpression): void {
                const properties = node.properties;
                write("Map");
                emitList(properties, ListFormat.ObjectLiteralExpressionProperties);
            }
            
            function emitPropertyAccessExpression(node: PropertyAccessExpression): void {
                emitExpression(node.expression);
                write(".");
                emit(node.name);
            }
            
            function emitElementAccessExpression(node: ElementAccessExpression): void {
                emitExpression(node.expression);
                write("(");
                emitExpression(node.argumentExpression);
                write(")");
            }
            
            function emitCallExpression(node: CallExpression): void {
                emitExpression(node.expression);
                emitTypeArguments(node.typeArguments);
                emitExpressionList(node.arguments, ListFormat.CallExpressionArguments);
            }

            function emitDecorators(decorators: NodeArray<Decorator>) {
                emitList(decorators, ListFormat.Decorators);
            }

            function emitTypeArguments(typeArguments: NodeArray<TypeNode>) {
                emitList(typeArguments, ListFormat.TypeArguments);
            }
            
            function emitNewExpression(node: NewExpression): void {
                write("new ");
                emitExpression(node.expression);
                emitTypeArguments(node.typeArguments);
                emitExpressionList(node.arguments, ListFormat.NewExpressionArguments);
            }

            function emitTemplateExpression(node: TemplateExpression): void {
                write("s");
                emit(node.head);
                emitList(node.templateSpans, ListFormat.TemplateExpressionSpans);
            }
            
            function emitTaggedTemplateExpression(node: TaggedTemplateExpression): void {
                console.log("emitTaggedTemplateExpression");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitTypeAssertionExpression(node: TypeAssertion): void {
                emitExpression(node.expression);
                write(".asInstanceOf[");
                emit(node.type);
                write("]");                
            }
            
            function emitParenthesizedExpression(node: ParenthesizedExpression): void {
                write("(");
                emitExpression(node.expression);
                write(")");
            }
            
            function emitFunctionExpression(node: FunctionExpression): void {
                emitFunctionLikeExpression(node);
            }
            
            function emitArrowFunction(node: ArrowFunction): void {
                write("(");                
                emitFunctionLikeExpression(node);
                write(")");
            }

            function emitFunctionLikeExpression(node: FunctionLikeDeclaration): void {
                emitDecorators(node.decorators);
                emitModifiers(node.modifiers);
                emitSignatureAndBody(node, emitArrowFunctionHead);
            }

            function emitArrowFunctionHead(node: FunctionLikeDeclaration) {
                emitTypeParameters(node.typeParameters);
                emitParametersForArrow(node.parameters);
                write(" => ");
            }

            function emitParametersForArrow(parameters: NodeArray<ParameterDeclaration>) {
                if (parameters &&
                    parameters.length === 1 &&
                    parameters[0].type === undefined) {
                    emit(parameters[0]);
                }
                else {
                    emitParameters(parameters);
                }
            }
            
            function emitParameters(parameters: NodeArray<ParameterDeclaration>) {
                emitList(parameters, ListFormat.Parameters);
            }
            
            function emitSignatureAndBody(node: FunctionLikeDeclaration, emitSignatureHead: (node: SignatureDeclaration) => void) {
                const body = node.body;
                if (body) {
                    if (isBlock(body)) {
                        if (getEmitFlags(node) & EmitFlags.ReuseTempVariableScope) {
                            emitSignatureHead(node);
                            emitBlockFunctionBody(body);
                        }
                        else {
                            emitSignatureHead(node);
                            emitBlockFunctionBody(body);
                        }
                    }
                    else {
                        emitSignatureHead(node);
                        write(" ");
                        emitExpression(body);
                    }
                }
                else {
                    emitSignatureHead(node);
                    write(";");
                }
            }

            function emitBlockFunctionBody(body: Block) {
                write(" {");
                writeLine();
                emitList(body.statements, ListFormat.SingleLineFunctionBodyStatements);
                writeLine();
                write("}")
            }
            
            function emitDeleteExpression(node: DeleteExpression): void {
                const expr = node.expression;
                switch (expr.kind) {
                    case SyntaxKind.PropertyAccessExpression:
                        const propAccessExpr = <PropertyAccessExpression>expr;
                        emitExpression(propAccessExpr.expression);
                        write(".remove(");
                        write('"' + propAccessExpr.name.text + '"');
                        write(")");
                        break;

                    case SyntaxKind.ElementAccessExpression:
                        const elemAccessExpr = <ElementAccessExpression>expr;
                        emitExpression(elemAccessExpr.expression);
                        write(".remove(");
                        emitExpression(elemAccessExpr.argumentExpression);
                        write(")");
                        break;

                    default:
                        console.log("Need to handle emitDeleteExpression() with " + expr.kind);
                }
            }
            
            function emitTypeOfExpression(node: TypeOfExpression): void {
                write("typeof(");
                emitExpression(node.expression);
                write(")");
            }
            
            function emitVoidExpression(node: VoidExpression): void {
                console.log("emitVoidExpression");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitAwaitExpression(node: AwaitExpression): void {
                console.log("emitAwaitExpression");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitPrefixUnaryExpression(node: PrefixUnaryExpression): void {
                write("(");
                emitTokenText(node.operator);
                emitExpression(node.operand);
                write(")");
            }
            
            function emitPostfixUnaryExpression(node: PostfixUnaryExpression): void {
                write("(");
                emitExpression(node.operand);
                switch(node.operator) {
                    case SyntaxKind.PlusPlusToken:
                       write("+= 1)")
                       break;
                    case SyntaxKind.MinusMinusToken:
                       write("-= 1)");
                       break;
                } 
            }
            
            function emitBinaryExpression(node: BinaryExpression): void {
                write("("); 
                emitExpression(node.left);
                emitTokenText(node.operatorToken.kind);
                emitExpression(node.right);
                write(")");
            }

            function emitConditionalExpression(node: ConditionalExpression): void {
                write("(");
                write("if (")
                emitExpression(node.condition);
                write(") ");
                emitExpression(node.whenTrue);
                write(" else ");
                emitExpression(node.whenFalse);
                write(")");                
            }
        
            function emitYieldExpression(node: YieldExpression): void {
                console.log("emitYieldExpression");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitSpreadElementExpression(node: SpreadElementExpression): void {
                emitExpression(node.expression);
                write(": _*");
            }
            
            function emitClassExpression(node: ClassExpression): void {
                console.log("emitClassExpression");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitAsExpression(node: AsExpression): void {
                emitExpression(node.expression);
                if (node.type) {
                    write(".asInstanceOf[");
                    emit(node.type);
                    write("]");
                }
            }
            
            function emitNonNullExpression(node: NonNullExpression): void {
                console.log("emitNonNullExpression");
                console.log("Need to handle node kind " + node.kind);
            }
            
            function emitList(children: NodeArray<Node>, format: ListFormat, start?: number, count?: number) {
                emitNodeList(emit, children, format, start, count);
            }

            function emitExpressionList(children: NodeArray<Node>, format: ListFormat, start?: number, count?: number) {
                emitNodeList(emitExpression, children, format, start, count);
            }

            function emitExpression(node: Node): void { emit(node); }

            function emitNodeList(emit: (node: Node) => void, children: NodeArray<Node>, format: ListFormat, start = 0, count = children ? children.length - start : 0) {
                const isUndefined = children === undefined;
                if (isUndefined && format & ListFormat.OptionalIfUndefined) {
                    return;
                }

                const isEmpty = isUndefined || children.length === 0 || start >= children.length || count === 0;
                if (isEmpty && format & ListFormat.OptionalIfEmpty) {
                    return;
                }

                if (format & ListFormat.BracketsMask) {
                    write(getOpeningBracket(format));
                }

                if (isEmpty) {
                    // Write a line terminator if the parent node was multi-line
                    if (format & ListFormat.MultiLine) {
                        writeLine();
                    }
                    else if (format & ListFormat.SpaceBetweenBraces) {
                        write(" ");
                    }
                }
                else {
                    write(" ");
                    // Emit each child.
                    let previousSibling: Node;
                    const delimiter = getDelimiter(format);
                    for (let i = 0; i < count; i++) {
                        const child = children[start + i];

                        // Write the delimiter if this is not the first node.
                        if (previousSibling) {
                            write(delimiter);
                            if (format & ListFormat.MultiLine)
                                writeLine();
                            else
                                write(" ");
                        }

                        // Emit this child.
                        emit(child);

                        previousSibling = child;
                    }

                    // Write a trailing comma, if requested.
                    const hasTrailingComma = (format & ListFormat.AllowTrailingComma) && children.hasTrailingComma;
                    if (format & ListFormat.CommaDelimited && hasTrailingComma) {
                        write(",");
                    }


                    // Write the closing line terminator or closing whitespace.
                    write(" ");
                }

                if (format & ListFormat.BracketsMask) {
                    write(getClosingBracket(format));
                }
            }
            
            function emitWithPrefix(prefix: string, node: Node) {
                emitNodeWithPrefix(prefix, node, emit);
            }
            
            function emitExpressionWithPrefix(prefix: string, node: Node) {
                emitNodeWithPrefix(prefix, node, emitExpression);
            }

            function emitNodeWithPrefix(prefix: string, node: Node, emit: (node: Node) => void) {
                if (node) {
                    write(prefix);
                    emit(node);
                }
            }

            function getLiteralTextOfNode(node: LiteralLikeNode): string {
                if (node.kind === SyntaxKind.StringLiteral && (<StringLiteral>node).textSourceNode) {
                    const textSourceNode = (<StringLiteral>node).textSourceNode;
                    if (isIdentifier(textSourceNode)) {
                        return "\"" + escapeNonAsciiCharacters(escapeString(getTextOfNode(textSourceNode))) + "\"";
                    }
                    else {
                        return getLiteralTextOfNode(textSourceNode);
                    }
                }

                function getQuotedEscapedLiteralText(leftQuote: string, text: string, rightQuote: string) {
                    return leftQuote + escapeNonAsciiCharacters(escapeString(text)) + rightQuote;
                }

                // If we can't reach the original source text, use the canonical form if it's a number,
                // or an escaped quoted form of the original text if it's string-like.
                switch (node.kind) {
                    case SyntaxKind.StringLiteral:
                        return getQuotedEscapedLiteralText('"', node.text, '"');
                    case SyntaxKind.NoSubstitutionTemplateLiteral:
                        return getQuotedEscapedLiteralText("\"\"\"", node.text, "\"\"\"");
                    case SyntaxKind.TemplateHead:
                        return getQuotedEscapedLiteralText("\"\"\"", node.text, "${");
                    case SyntaxKind.TemplateMiddle:
                        return getQuotedEscapedLiteralText("}", node.text, "${");
                    case SyntaxKind.TemplateTail:
                        return getQuotedEscapedLiteralText("}", node.text, "\"\"\"");
                    case SyntaxKind.NumericLiteral:
                        return node.text;
                    case SyntaxKind.RegularExpressionLiteral:
                        const text = node.text.substring(1);
                        const slashPos = text.lastIndexOf('/');
                        const pattern0 = text.substring(0, slashPos);
                        let pattern = "";
                        for (let i = 0; i < pattern0.length; ++i) {
                            if (pattern0[i] == '$')
                                pattern += '$$';
                            else
                                pattern += pattern0[i];
                        }
                        const flags = text.substring(slashPos + 1);
                        if (flags === '')
                            return 'java.util.regex.Pattern.compile(raw"""' + pattern + '""")';
                        else
                            return 'java.util.regex.Pattern.compile(raw"""' + pattern + '""", "' + flags + '")';
                }
            }

            function emitLiteral(node: LiteralLikeNode) {
                write(getLiteralTextOfNode(node));
            }
            
            function emitNumericLiteral(node: NumericLiteral): void {
                emitLiteral(node);
            }

            function emit(node: Node): void {
                switch (node.kind) {
                    // SourceFile
                    case SyntaxKind.SourceFile:
                        return emitSourceFile(<SourceFile>node);

                    // Literals
                    case SyntaxKind.NumericLiteral:
                        return emitNumericLiteral(<NumericLiteral>node);

                    case SyntaxKind.StringLiteral:
                    case SyntaxKind.RegularExpressionLiteral:
                    case SyntaxKind.NoSubstitutionTemplateLiteral:
                        return emitLiteral(<LiteralExpression>node);


                    // Pseudo-literals
                    case SyntaxKind.TemplateHead:
                    case SyntaxKind.TemplateMiddle:
                    case SyntaxKind.TemplateTail:
                        return emitLiteral(<LiteralExpression>node);

                    // Identifiers
                    case SyntaxKind.Identifier:
                        return emitIdentifier(<Identifier>node);

                    // Reserved words
                    case SyntaxKind.FalseKeyword:
                    case SyntaxKind.NullKeyword:
                    case SyntaxKind.SuperKeyword:
                    case SyntaxKind.TrueKeyword:
                    case SyntaxKind.ThisKeyword:

                    // Reserved words
                    case SyntaxKind.ConstKeyword:
                    case SyntaxKind.DefaultKeyword:
                    case SyntaxKind.ExportKeyword:
                    case SyntaxKind.VoidKeyword:

                    // Strict mode reserved words
                    case SyntaxKind.PrivateKeyword:
                    case SyntaxKind.ProtectedKeyword:
                    case SyntaxKind.PublicKeyword:
                    case SyntaxKind.StaticKeyword:

                    // Contextual keywords
                    case SyntaxKind.AbstractKeyword:
                    case SyntaxKind.AsKeyword:
                    case SyntaxKind.AnyKeyword:
                    case SyntaxKind.AsyncKeyword:
                    case SyntaxKind.AwaitKeyword:
                    case SyntaxKind.BooleanKeyword:
                    case SyntaxKind.ConstructorKeyword:
                    case SyntaxKind.DeclareKeyword:
                    case SyntaxKind.GetKeyword:
                    case SyntaxKind.IsKeyword:
                    case SyntaxKind.ModuleKeyword:
                    case SyntaxKind.NamespaceKeyword:
                    case SyntaxKind.NeverKeyword:
                    case SyntaxKind.ReadonlyKeyword:
                    case SyntaxKind.RequireKeyword:
                    case SyntaxKind.NumberKeyword:
                    case SyntaxKind.SetKeyword:
                    case SyntaxKind.StringKeyword:
                    case SyntaxKind.SymbolKeyword:
                    case SyntaxKind.TypeKeyword:
                    case SyntaxKind.UndefinedKeyword:
                    case SyntaxKind.FromKeyword:
                    case SyntaxKind.GlobalKeyword:
                    case SyntaxKind.OfKeyword:
                        emitTokenText(node.kind);
                        return;

                    // Parse tree nodes

                    // Names
                    case SyntaxKind.QualifiedName:
                        return emitQualifiedName(<QualifiedName>node);
                    case SyntaxKind.ComputedPropertyName:
                        return emitComputedPropertyName(<ComputedPropertyName>node);

                    // Signature elements
                    case SyntaxKind.TypeParameter:
                        return emitTypeParameter(<TypeParameterDeclaration>node);
                    case SyntaxKind.Parameter:
                        return emitParameter(<ParameterDeclaration>node);
                    case SyntaxKind.Decorator:
                        return emitDecorator(<Decorator>node);

                    // Type members
                    case SyntaxKind.PropertySignature:
                        return emitPropertySignature(<PropertySignature>node);
                    case SyntaxKind.PropertyDeclaration:
                        return emitPropertyDeclaration(<PropertyDeclaration>node);
                    case SyntaxKind.MethodSignature:
                        return emitMethodSignature(<MethodSignature>node);
                    case SyntaxKind.MethodDeclaration:
                        return emitMethodDeclaration(<MethodDeclaration>node);
                    case SyntaxKind.Constructor:
                        return emitConstructor(<ConstructorDeclaration>node);
                    case SyntaxKind.GetAccessor:
                    case SyntaxKind.SetAccessor:
                        return emitAccessorDeclaration(<AccessorDeclaration>node);
                    case SyntaxKind.CallSignature:
                        return emitCallSignature(<CallSignatureDeclaration>node);
                    case SyntaxKind.ConstructSignature:
                        return emitConstructSignature(<ConstructSignatureDeclaration>node);
                    case SyntaxKind.IndexSignature:
                        return emitIndexSignature(<IndexSignatureDeclaration>node);

                    // Types
                    case SyntaxKind.TypePredicate:
                        return emitTypePredicate(<TypePredicateNode>node);
                    case SyntaxKind.TypeReference:
                        return emitTypeReference(<TypeReferenceNode>node);
                    case SyntaxKind.FunctionType:
                        return emitFunctionType(<FunctionTypeNode>node);
                    case SyntaxKind.ConstructorType:
                        return emitConstructorType(<ConstructorTypeNode>node);
                    case SyntaxKind.TypeQuery:
                        return emitTypeQuery(<TypeQueryNode>node);
                    case SyntaxKind.TypeLiteral:
                        return emitTypeLiteral(<TypeLiteralNode>node);
                    case SyntaxKind.ArrayType:
                        return emitArrayType(<ArrayTypeNode>node);
                    case SyntaxKind.TupleType:
                        return emitTupleType(<TupleTypeNode>node);
                    case SyntaxKind.UnionType:
                        return emitUnionType(<UnionTypeNode>node);
                    case SyntaxKind.IntersectionType:
                        return emitIntersectionType(<IntersectionTypeNode>node);
                    case SyntaxKind.ParenthesizedType:
                        return emitParenthesizedType(<ParenthesizedTypeNode>node);
                    case SyntaxKind.ExpressionWithTypeArguments:
                        return emitExpressionWithTypeArguments(<ExpressionWithTypeArguments>node);
                    case SyntaxKind.ThisType:
                        return emitThisType();
                    case SyntaxKind.LiteralType:
                        return emitLiteralType(<LiteralTypeNode>node);

                    // Binding patterns
                    case SyntaxKind.ObjectBindingPattern:
                        return emitObjectBindingPattern(<ObjectBindingPattern>node);
                    case SyntaxKind.ArrayBindingPattern:
                        return emitArrayBindingPattern();
                    case SyntaxKind.BindingElement:
                        return emitBindingElement();

                    // Misc
                    case SyntaxKind.TemplateSpan:
                        return emitTemplateSpan(<TemplateSpan>node);
                    case SyntaxKind.SemicolonClassElement:
                        return emitSemicolonClassElement();

                    // Statements
                    case SyntaxKind.Block:
                        return emitBlock(<Block>node);
                    case SyntaxKind.VariableStatement:
                        return emitVariableStatement(<VariableStatement>node);
                    case SyntaxKind.EmptyStatement:
                        return emitEmptyStatement();
                    case SyntaxKind.ExpressionStatement:
                        return emitExpressionStatement(<ExpressionStatement>node);
                    case SyntaxKind.IfStatement:
                        return emitIfStatement(<IfStatement>node);
                    case SyntaxKind.DoStatement:
                        return emitDoStatement(<DoStatement>node);
                    case SyntaxKind.WhileStatement:
                        return emitWhileStatement(<WhileStatement>node);
                    case SyntaxKind.ForStatement:
                        return emitForStatement(<ForStatement>node);
                    case SyntaxKind.ForInStatement:
                        return emitForInStatement(<ForInStatement>node);
                    case SyntaxKind.ForOfStatement:
                        return emitForOfStatement(<ForOfStatement>node);
                    case SyntaxKind.ContinueStatement:
                        return emitContinueStatement(<ContinueStatement>node);
                    case SyntaxKind.BreakStatement:
                        return emitBreakStatement(<BreakStatement>node);
                    case SyntaxKind.ReturnStatement:
                        return emitReturnStatement(<ReturnStatement>node);
                    case SyntaxKind.WithStatement:
                        return emitWithStatement(<WithStatement>node);
                    case SyntaxKind.SwitchStatement:
                        return emitSwitchStatement(<SwitchStatement>node);
                    case SyntaxKind.LabeledStatement:
                        return emitLabeledStatement(<LabeledStatement>node);
                    case SyntaxKind.ThrowStatement:
                        return emitThrowStatement(<ThrowStatement>node);
                    case SyntaxKind.TryStatement:
                        return emitTryStatement(<TryStatement>node);
                    case SyntaxKind.DebuggerStatement:
                        return emitDebuggerStatement();

                    // Declarations
                    case SyntaxKind.VariableDeclaration:
                        return emitVariableDeclaration(<VariableDeclaration>node);
                    case SyntaxKind.VariableDeclarationList:
                        return emitVariableDeclarationList(<VariableDeclarationList>node);
                    case SyntaxKind.FunctionDeclaration:
                        return emitFunctionDeclaration(<FunctionDeclaration>node);
                    case SyntaxKind.ClassDeclaration:
                        return emitClassDeclaration(<ClassDeclaration>node);
                    case SyntaxKind.InterfaceDeclaration:
                        return emitInterfaceDeclaration(<InterfaceDeclaration>node);
                    case SyntaxKind.TypeAliasDeclaration:
                        return emitTypeAliasDeclaration(<TypeAliasDeclaration>node);
                    case SyntaxKind.EnumDeclaration:
                        return emitEnumDeclaration(<EnumDeclaration>node);
                    case SyntaxKind.ModuleDeclaration:
                        return emitModuleDeclaration(<ModuleDeclaration>node);
                    case SyntaxKind.ModuleBlock:
                        return emitModuleBlock(<ModuleBlock>node);
                    case SyntaxKind.ImportEqualsDeclaration:
                        return emitImportEqualsDeclaration(<ImportEqualsDeclaration>node);
                    case SyntaxKind.ImportDeclaration:
                        return emitImportDeclaration(<ImportDeclaration>node);
                    case SyntaxKind.ImportClause:
                        return emitImportClause(<ImportClause>node);
                    case SyntaxKind.NamespaceImport:
                        return emitNamespaceImport(<NamespaceImport>node);
                    case SyntaxKind.NamedImports:
                        return emitNamedImports(<NamedImports>node);
                    case SyntaxKind.ImportSpecifier:
                        return emitImportSpecifier(<ImportSpecifier>node);
                    case SyntaxKind.ExportAssignment:
                        return emitExportAssignment(<ExportAssignment>node);
                    case SyntaxKind.ExportDeclaration:
                        return emitExportDeclaration(<ExportDeclaration>node);
                    case SyntaxKind.NamedExports:
                        return emitNamedExports(<NamedExports>node);
                    case SyntaxKind.ExportSpecifier:
                        return emitExportSpecifier(<ExportSpecifier>node);
                    case SyntaxKind.MissingDeclaration:
                        return;

                    // Module references
                    case SyntaxKind.ExternalModuleReference:
                        return emitExternalModuleReference(<ExternalModuleReference>node);

                    // Expressions
                    case SyntaxKind.ArrayLiteralExpression:
                        return emitArrayLiteralExpression(<ArrayLiteralExpression>node);
                    case SyntaxKind.ObjectLiteralExpression:
                        return emitObjectLiteralExpression(<ObjectLiteralExpression>node);
                    case SyntaxKind.PropertyAccessExpression:
                        return emitPropertyAccessExpression(<PropertyAccessExpression>node);
                    case SyntaxKind.ElementAccessExpression:
                        return emitElementAccessExpression(<ElementAccessExpression>node);
                    case SyntaxKind.CallExpression:
                        return emitCallExpression(<CallExpression>node);
                    case SyntaxKind.NewExpression:
                        return emitNewExpression(<NewExpression>node);
                    case SyntaxKind.TaggedTemplateExpression:
                        return emitTaggedTemplateExpression(<TaggedTemplateExpression>node);
                    case SyntaxKind.TypeAssertionExpression:
                        return emitTypeAssertionExpression(<TypeAssertion>node);
                    case SyntaxKind.ParenthesizedExpression:
                        return emitParenthesizedExpression(<ParenthesizedExpression>node);
                    case SyntaxKind.FunctionExpression:
                        return emitFunctionExpression(<FunctionExpression>node);
                    case SyntaxKind.ArrowFunction:
                        return emitArrowFunction(<ArrowFunction>node);
                    case SyntaxKind.DeleteExpression:
                        return emitDeleteExpression(<DeleteExpression>node);
                    case SyntaxKind.TypeOfExpression:
                        return emitTypeOfExpression(<TypeOfExpression>node);
                    case SyntaxKind.VoidExpression:
                        return emitVoidExpression(<VoidExpression>node);
                    case SyntaxKind.AwaitExpression:
                        return emitAwaitExpression(<AwaitExpression>node);
                    case SyntaxKind.PrefixUnaryExpression:
                        return emitPrefixUnaryExpression(<PrefixUnaryExpression>node);
                    case SyntaxKind.PostfixUnaryExpression:
                        return emitPostfixUnaryExpression(<PostfixUnaryExpression>node);
                    case SyntaxKind.BinaryExpression:
                        return emitBinaryExpression(<BinaryExpression>node);
                    case SyntaxKind.ConditionalExpression:
                        return emitConditionalExpression(<ConditionalExpression>node);
                    case SyntaxKind.TemplateExpression:
                        return emitTemplateExpression(<TemplateExpression>node);
                    case SyntaxKind.YieldExpression:
                        return emitYieldExpression(<YieldExpression>node);
                    case SyntaxKind.SpreadElementExpression:
                        return emitSpreadElementExpression(<SpreadElementExpression>node);
                    case SyntaxKind.ClassExpression:
                        return emitClassExpression(<ClassExpression>node);
                    case SyntaxKind.OmittedExpression:
                        return;
                    case SyntaxKind.AsExpression:
                        return emitAsExpression(<AsExpression>node);
                    case SyntaxKind.NonNullExpression:
                        return emitNonNullExpression(<NonNullExpression>node);

                    // JSX (non-expression)
                    case SyntaxKind.JsxText:
                        return;
                    case SyntaxKind.JsxOpeningElement:
                        return;
                    case SyntaxKind.JsxClosingElement:
                        return;
                    case SyntaxKind.JsxAttribute:
                        return;
                    case SyntaxKind.JsxSpreadAttribute:
                        return;
                    case SyntaxKind.JsxExpression:
                        return;

                    // Clauses
                    case SyntaxKind.HeritageClause:
                        return emitHeritageClause(<HeritageClause>node);
                    case SyntaxKind.CatchClause:
                        return emitCatchClause(<CatchClause>node);

                    // Property assignments
                    case SyntaxKind.PropertyAssignment:
                        return emitPropertyAssignment(<PropertyAssignment>node);
                    case SyntaxKind.ShorthandPropertyAssignment:
                        return emitShorthandPropertyAssignment(<ShorthandPropertyAssignment>node);

                    // Enum
                    case SyntaxKind.EnumMember:
                        return emitEnumMember(<EnumMember>node);

                    default:
                        console.log("uknown node kind: " + node.kind);
                        return;

                    // JSDoc nodes (ignored)
                    // Transformation nodes (ignored)
                }
            }
        }
    }

    const enum ListFormat {
        None = 0,

        // Line separators
        SingleLine = 0,                 // Prints the list on a single line (default).
        MultiLine = 1 << 0,             // Prints the list on multiple lines.
        PreserveLines = 1 << 1,         // Prints the list using line preservation if possible.
        LinesMask = SingleLine | MultiLine | PreserveLines,

        // Delimiters
        NotDelimited = 0,               // There is no delimiter between list items (default).
        BarDelimited = 1 << 2,          // Each list item is space-and-bar (" |") delimited.
        WithDelimited = 1 << 3,         // Each list item is space-and-with (" with") delimited.
        CommaDelimited = 1 << 4,        // Each list item is comma (",") delimited.
        DelimitersMask = BarDelimited | WithDelimited | CommaDelimited,

        AllowTrailingComma = 1 << 5,    // Write a trailing comma (",") if present.

        // Whitespace
        Indented = 1 << 6,              // The list should be indented.
        SpaceBetweenBraces = 1 << 7,    // Inserts a space after the opening brace and before the closing brace.
        SpaceBetweenSiblings = 1 << 8,  // Inserts a space between each sibling node.

        // Brackets/Braces
        Braces = 1 << 9,                 // The list is surrounded by "{" and "}".
        Parenthesis = 1 << 10,          // The list is surrounded by "(" and ")".
        AngleBrackets = 1 << 11,        // The list is surrounded by "<" and ">".
        SquareBrackets = 1 << 12,       // The list is surrounded by "[" and "]".
        BracketsMask = Braces | Parenthesis | AngleBrackets | SquareBrackets,

        OptionalIfUndefined = 1 << 13,  // Do not emit brackets if the list is undefined.
        OptionalIfEmpty = 1 << 14,      // Do not emit brackets if the list is empty.
        Optional = OptionalIfUndefined | OptionalIfEmpty,

        // Other
        PreferNewLine = 1 << 15,        // Prefer adding a LineTerminator between synthesized nodes.
        NoTrailingNewLine = 1 << 16,    // Do not emit a trailing NewLine for a MultiLine list.
        NoInterveningComments = 1 << 17, // Do not emit comments between each node

        // Precomputed Formats
        Modifiers = SingleLine | SpaceBetweenSiblings,
        HeritageClauses = SingleLine | SpaceBetweenSiblings,
        TypeLiteralMembers = MultiLine | Indented,
        TupleTypeElements = CommaDelimited | SpaceBetweenSiblings | SingleLine | Indented,
        UnionTypeConstituents = BarDelimited | SpaceBetweenSiblings | SingleLine,
        IntersectionTypeConstituents = WithDelimited | SpaceBetweenSiblings | SingleLine,
        ObjectBindingPatternElements = SingleLine | AllowTrailingComma | SpaceBetweenBraces | CommaDelimited | SpaceBetweenSiblings,
        ArrayBindingPatternElements = SingleLine | AllowTrailingComma | CommaDelimited | SpaceBetweenSiblings,
        ObjectLiteralExpressionProperties = MultiLine | CommaDelimited | Indented | Parenthesis,
        ArrayLiteralExpressionElements = PreserveLines | CommaDelimited | SpaceBetweenSiblings | AllowTrailingComma | Indented | Parenthesis,
        CallExpressionArguments = CommaDelimited | SpaceBetweenSiblings | SingleLine | Parenthesis,
        NewExpressionArguments = CommaDelimited | SpaceBetweenSiblings | SingleLine | Parenthesis | OptionalIfUndefined,
        TemplateExpressionSpans = SingleLine | NoInterveningComments,
        SingleLineBlockStatements = SpaceBetweenBraces | SpaceBetweenSiblings | SingleLine,
        MultiLineBlockStatements = Indented | MultiLine,
        VariableDeclarationList = CommaDelimited | SpaceBetweenSiblings | SingleLine,
        SingleLineFunctionBodyStatements = SingleLine | SpaceBetweenSiblings | SpaceBetweenBraces,
        MultiLineFunctionBodyStatements = MultiLine,
        ClassHeritageClauses = SingleLine | SpaceBetweenSiblings,
        ClassMembers = Indented | MultiLine,
        InterfaceMembers = Indented | MultiLine,
        EnumMembers = Indented | MultiLine,
        CaseBlockClauses = Indented | MultiLine,
        NamedImportsOrExportsElements = CommaDelimited | SpaceBetweenSiblings | AllowTrailingComma | SingleLine | SpaceBetweenBraces,
        JsxElementChildren = SingleLine | NoInterveningComments,
        JsxElementAttributes = SingleLine | SpaceBetweenSiblings | NoInterveningComments,
        CaseOrDefaultClauseStatements = Indented | MultiLine | NoTrailingNewLine | OptionalIfEmpty,
        HeritageClauseTypes = CommaDelimited | SpaceBetweenSiblings | SingleLine,
        SourceFileStatements = MultiLine | NoTrailingNewLine,
        Decorators = MultiLine | Optional,
        TypeArguments = CommaDelimited | SpaceBetweenSiblings | SingleLine | Indented | SquareBrackets | Optional,
        TypeParameters = CommaDelimited | SpaceBetweenSiblings | SingleLine | Indented | SquareBrackets | Optional,
        Parameters = CommaDelimited | SpaceBetweenSiblings | SingleLine | Indented | Parenthesis,
        IndexSignatureParameters = CommaDelimited | SpaceBetweenSiblings | SingleLine | Indented | SquareBrackets,
    }

    function isSingleLineEmptyBlock(block: Block) {
        return !block.multiLine
            && isEmptyBlock(block);
    }

    function isEmptyBlock(block: BlockLike) {
        return block.statements.length === 0;
    }

    function createDelimiterMap() {
        const delimiters: string[] = [];
        delimiters[ListFormat.None] = "";
        delimiters[ListFormat.CommaDelimited] = ",";
        delimiters[ListFormat.BarDelimited] = " |";
        delimiters[ListFormat.WithDelimited] = " with";
        return delimiters;
    }

    function createBracketsMap() {
        const brackets: string[][] = [];
        brackets[ListFormat.Braces] = ["{", "}"];
        brackets[ListFormat.Parenthesis] = ["(", ")"];
        brackets[ListFormat.AngleBrackets] = ["<", ">"];
        brackets[ListFormat.SquareBrackets] = ["[", "]"];
        return brackets;
    }

    const brackets = createBracketsMap();
    
    function getOpeningBracket(format: ListFormat) {
        return brackets[format & ListFormat.BracketsMask][0];
    }

    function getClosingBracket(format: ListFormat) {
        return brackets[format & ListFormat.BracketsMask][1];
    }

    const delimeters = createDelimiterMap();

    function getDelimiter(format: ListFormat) {
        return delimeters[format & ListFormat.DelimitersMask];
    }
}
